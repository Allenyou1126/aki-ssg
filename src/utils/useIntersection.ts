import { useRef, useState, useCallback, useEffect } from "react";

type UseIntersectionObserverInit = Pick<
	IntersectionObserverInit,
	"rootMargin" | "root"
>;
type UseIntersection = { disabled?: boolean } & UseIntersectionObserverInit & {
		rootRef?: React.RefObject<HTMLElement> | null;
	};
type ObserveCallback = (isVisible: boolean) => void;
type Identifier = { root: Element | Document | null; margin: string };
type Observer = {
	id: Identifier;
	observer: IntersectionObserver;
	elements: Map<Element, ObserveCallback>;
};

const hasIntersectionObserver = typeof IntersectionObserver !== "undefined";

export function useIntersection<T extends Element>({
	rootRef,
	rootMargin,
	disabled,
}: UseIntersection): [(element: T | null) => void, boolean, () => void] {
	// 通过 isDisabled 控制 useEffect 中副作用是否需要执行
	const isDisabled: boolean = disabled || !hasIntersectionObserver;
	// 通过 Ref 缓存上一次调用 useIntersection 时生成的 unobserve 方法
	const unobserve = useRef<() => void>();
	const [visible, setVisible] = useState(false);
	// 设置 IntersectionObserver 的 root
	const [root, setRoot] = useState(rootRef ? rootRef.current : null);
	// React 回调 Ref
	const setRef = useCallback(
		(el: T | null) => {
			// unobserve 上一次调用 useIntersection 时观察的元素
			if (unobserve.current) {
				unobserve.current();
				unobserve.current = undefined;
			}

			if (isDisabled || visible) return;

			// 如果传入的 el 是一个 HTMLElement
			if (el && el.tagName) {
				unobserve.current = observe(
					el,
					(isVisible) => isVisible && setVisible(isVisible),
					{ root, rootMargin }
				);
			}
		},
		[isDisabled, root, rootMargin, visible]
	);

	useEffect(() => {
		if (!hasIntersectionObserver) {
			// 如果当前 Runtime 没有 IntersectionObserver（如 Node.js 服务端、或浏览器不兼容）
			// 在 rIC 后显示图片，作为 fallback。rIC 额外引入 Polyfill。
			if (!visible) {
				const idleCallback = requestIdleCallback(() => setVisible(true));
				return () => cancelIdleCallback(idleCallback);
			}
		}
	}, [visible]);

	useEffect(() => {
		if (rootRef) setRoot(rootRef.current);
	}, [rootRef]);

	// 暴露重置 visible 的方法
	const resetVisible = useCallback(() => setVisible(false), []);
	return [setRef, visible, resetVisible];
}

// 缓存 IntersectionObserver 实例
const observers = new Map<Identifier, Observer>();
const idList: Identifier[] = [];

function createObserver(options: UseIntersectionObserverInit): Observer {
	const id = { root: options.root || null, margin: options.rootMargin || "" };
	const existing = idList.find(
		(obj) => obj.root === id.root && obj.margin === id.margin
	);
	let instance;
	// 复用已有的 IntersectionObserver 实例
	if (existing) {
		instance = observers.get(existing);
	} else {
		instance = observers.get(id);
		idList.push(id);
	}
	if (instance) return instance;

	// 记录每个 IntersectionObserver 实例观察的元素，在所有观察的元素都进入 Viewport 后销毁实例
	const elements = new Map<Element, ObserveCallback>();
	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			const callback = elements.get(entry.target);
			const isVisible = entry.isIntersecting || entry.intersectionRatio > 0;
			if (callback && isVisible) callback(isVisible);
		});
	}, options);

	observers.set(id, (instance = { id, observer, elements }));
	return instance;
}

function observe(
	element: Element,
	callback: ObserveCallback,
	options: UseIntersectionObserverInit
): () => void {
	const { id, observer, elements } = createObserver(options);
	elements.set(element, callback);

	observer.observe(element);
	return function unobserve(): void {
		elements.delete(element);
		observer.unobserve(element);

		// 当没有元素需要观察时，销毁 IntersectionObserver 实例
		if (elements.size === 0) {
			observer.disconnect();
			observers.delete(id);
			const index = idList.findIndex(
				(obj) => obj.root === id.root && obj.margin === id.margin
			);
			if (index > -1) {
				idList.splice(index, 1);
			}
		}
	};
}
