/* eslint-disable @next/next/no-img-element */
"use client";
import { config } from "@/data/site-config";
import { connectString } from "@/utils/connectString";
import { getThumbUrl } from "@/utils/getThumbUrl";
import { useIntersection } from "@/utils/useIntersection";
import mediumZoom, { Zoom } from "medium-zoom";

import {
	useRef,
	useMemo,
	useLayoutEffect,
	RefCallback,
	useEffect,
	useCallback,
	useState,
} from "react";

const LOADED_IMAGE_URLS = new Set<string>();

const SMALLEST_GIF =
	"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

export const useImageFullyLoaded = (
	imageElRef: React.RefObject<HTMLImageElement>,
	srcString?: string
) => {
	const [isFullyLoaded, setIsFullyLoaded] = useState(false);
	const handleLoad = useCallback(() => {
		if (srcString) {
			const img = imageElRef.current;
			if (!img) return;
			// 真实图片元素当前的 src（currentSrc，当网页用 picture / source 元素指定了变种后，浏览器实际采用的 src）
			const imgSrc = img.currentSrc || img.src;
			if (
				imgSrc &&
				(config.optimize.thumb_query
					? !imgSrc.endsWith(config.optimize.thumb_query)
					: imgSrc !== SMALLEST_GIF)
			) {
				// 利用 HTMLImageElement.prototype.decode API，获取图片解码后的回调
				// 在不兼容的浏览器上直接等待一个 microtask
				const promise = "decode" in img ? img.decode() : Promise.resolve();
				promise
					.catch(() => {})
					.then(() => {
						if (!imageElRef.current) return;
						// 记录已经加载完、解码的图片
						LOADED_IMAGE_URLS.add(srcString);
						setIsFullyLoaded(true);
					});
			}
		}
	}, [imageElRef, srcString]);
	// 由于 SSR 输出了完整 HTML，而页面的 JS 又全部都是异步加载。
	// 浏览器可能在 React DOM 还没 Hydration 时就完成了图片的下载，因此不能直接添加 onLoad
	useEffect(() => {
		if (imageElRef.current) {
			if (imageElRef.current.complete) {
				handleLoad();
			} else {
				imageElRef.current.onload = handleLoad;
			}
		}
	}, [handleLoad, imageElRef]);

	return isFullyLoaded;
};

export default function ImageClient(props: JSX.IntrinsicElements["img"]) {
	const {
		src,
		className,
		ref,
		decoding,
		crossOrigin,
		width,
		height,
		alt,
		...rest
	} = props;
	const rawImageElRef = useRef<HTMLImageElement | null>(null);
	const previousSrcRef = useRef<string | undefined>(src);
	const isLazy = useMemo(() => {
		if (!src) return false;
		if (src?.startsWith("data:") || src?.startsWith("blob:")) return false;
		if (typeof window !== "undefined") {
			if (LOADED_IMAGE_URLS.has(src)) return false;
		}
		return true;
	}, [src]);

	const isImageFullyLoaded = useImageFullyLoaded(rawImageElRef, src);

	const [setIntersection, isIntersected, resetIntersected] =
		useIntersection<HTMLImageElement>({
			rootMargin: "200px",
			disabled: false,
		});

	useLayoutEffect(() => {
		if (previousSrcRef.current !== src) {
			previousSrcRef.current = src;
			resetIntersected();
		}
		setIntersection(rawImageElRef.current);
	}, [resetIntersected, setIntersection, src]);
	const zoomRef = useRef<Zoom | null>(null);
	function getZoom() {
		if (zoomRef.current === null) {
			zoomRef.current = mediumZoom({
				background: "rgb(0, 0, 0, 0.3)",
			});
		}
		return zoomRef.current;
	}
	const imageElRef: RefCallback<HTMLImageElement> = (node) => {
		rawImageElRef.current = node;
		const zoom = getZoom();
		if (node) {
			zoom.attach(node);
		} else {
			zoom.detach();
		}
	};
	const isVisible = !isLazy || isIntersected;
	const thumbSrcString =
		src && !(src.startsWith("data:") || src.startsWith("blob:"))
			? getThumbUrl(src!)
			: SMALLEST_GIF;
	const srcString = isVisible ? src : thumbSrcString;
	if (!config.optimize.thumb_query) {
		return (
			<img
				{...rest}
				className={connectString([
					"border-box p-0 border-0 m-auto cursor-zoom-in bg-primary/60 block zoomable",
					props.className == null ? "" : props.className,
				])}
				ref={imageElRef}
				decoding="async"
				crossOrigin="anonymous"
				src={srcString}
			/>
		);
	}
	let ratio = 1.0;
	if (typeof width! === "number") {
		ratio = width!;
	} else {
		ratio = parseInt(width!);
	}
	if (typeof height! === "number") {
		ratio /= height!;
	} else {
		ratio /= parseInt(height!);
	}
	return (
		<span className="inline-block box-border relative max-w-full w-full h-auto my-auto mt-0 mb-1 text-[0]">
			<img
				{...rest}
				style={{
					width: width!,
					aspectRatio: ratio,
				}}
				className={connectString([
					"border-box p-0 border-0 m-auto block cursor-zoom-in zoomable bg-primary/60",
					props.className == null ? "" : props.className,
				])}
				ref={imageElRef}
				decoding="async"
				crossOrigin="anonymous"
				src={srcString}
			/>
			{alt && (
				<span className="block text-lg opacity-80 text-center w-full my-2">
					{alt}
				</span>
			)}
		</span>
	);
}
