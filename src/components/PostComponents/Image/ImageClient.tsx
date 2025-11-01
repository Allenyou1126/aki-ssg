/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client";
import { config } from "@/data/site-config";
import { getThumbUrl } from "@/utils/getThumbUrl";
import { useIntersection } from "@/utils/useIntersection";
import * as stylex from "@stylexjs/stylex";

import {
	useRef,
	useMemo,
	useLayoutEffect,
	useCallback,
	useState,
	JSX,
	useEffect,
} from "react";
import { createPortal } from "react-dom";
import { delay } from "@/utils/delay";

const LOADED_IMAGE_URLS = new Set<string>();

const SMALLEST_GIF =
	"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

const styles = stylex.create({
	img: {
		borderWidth: 0,
		boxSizing: "border-box",
		cursor: "zoom-in",
		margin: "auto",
		padding: 0,
	},
	alt: {
		display: "block",
		fontSize: "1.125rem",
		lineHeight: "1.75rem",
		marginBlock: "0.5rem",
		marginInline: "0",
		opacity: 0.8,
		textAlign: "center",
		width: "100%",
	},
	wrap: {
		boxSizing: "border-box",
		display: "inline-block",
		fontSize: 0,
		height: "auto",
		marginBottom: "0.25rem",
		marginLeft: 0,
		marginRight: 0,
		marginTop: 0,
		maxWidth: "100%",
		position: "relative",
		width: "100%",
	},
	thumb: {
		filter:
			"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='$'%3E%3CfeGaussianBlur stdDeviation='10'/%3E%3CfeColorMatrix type='matrix' values='1 0 0 0 0,0 1 0 0 0,0 0 1 0 0,0 0 0 9 0'/%3E%3CfeComposite in2='SourceGraphic' operator='in'/%3E%3C/filter%3E%3C/svg%3E#$\")",
	},
	zoomed: {
		cursor: "zoom-out",
		display: "block",
		maxHeight: "none",
		maxWidth: "none",
		objectFit: "contain",
		position: "fixed",
		transformOrigin: "top left",
		transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
		zIndex: 999,
	},
	overlay: {
		backgroundColor: "rgba(0, 0, 0, 0.3)",
		bottom: 0,
		cursor: "zoom-out",
		left: 0,
		position: "fixed",
		right: 0,
		top: 0,
		transition: "opacity 0.3s ease",
		zIndex: 40,
	},
	hidden: {
		display: "none",
	},
	inline: {
		display: "inline-block",
	},
	block: {
		display: "block",
	},
	noTop: {
		marginTop: 0,
	},
	noBottom: {
		marginBottom: 0,
	},
});

export default function ImageClient(
	props: JSX.IntrinsicElements["img"] & { inline?: boolean } & StyleProps
) {
	const {
		src,
		ref,
		decoding,
		width,
		height,
		alt,
		inline,
		parent,
		first,
		last,
		noTop,
		noBottom,
		...rest
	} = props;

	// 图片属性
	const w = typeof width! === "number" ? width! : parseInt(width!);
	const h = typeof height! === "number" ? height! : parseInt(height!);
	const ratio = w / h;

	// 图片懒加载用
	const rawImageElRef = useRef<HTMLImageElement>(null);
	const previousSrcRef = useRef<string | Blob | undefined>(src);

	// 图片缩放用
	const zoomedImageRef = useRef<HTMLImageElement>(null);
	const zoomedOverlayRef = useRef<HTMLDivElement>(null);

	// 仅浏览器环境渲染缩放图片
	const [isBrowser, setIsBrowser] = useState(false);
	useEffect(() => {
		setIsBrowser(true);
	}, []);

	// 图片缩放状态
	const [isZoomed, setIsZoomed] = useState(false);
	const [transform, setTransform] = useState<{
		x: number;
		y: number;
		scale: number;
	} | null>(null);

	// 图片懒加载逻辑
	const isLazy = useMemo(() => {
		if (!src || typeof src !== "string") return false;
		if (src?.startsWith("data:") || src?.startsWith("blob:")) return false;
		if (typeof window !== "undefined") {
			if (LOADED_IMAGE_URLS.has(src)) return false;
		}
		return true;
	}, [src]);
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
	const [isFullyLoaded, setIsFullyLoaded] = useState(false);
	const handleLoad = useCallback(() => {
		if (!src || typeof src !== "string") {
			return;
		}
		const img = rawImageElRef.current;
		if (!img) return;
		const imgSrc = img.currentSrc || img.src;
		if (
			imgSrc &&
			(config.optimize.thumb_query
				? !imgSrc.endsWith(config.optimize.thumb_query)
				: imgSrc !== SMALLEST_GIF)
		) {
			const promise = "decode" in img ? img.decode() : Promise.resolve();
			promise
				.catch(() => {})
				.then(() => {
					setIsFullyLoaded(true);
					if (!rawImageElRef.current) return;
					LOADED_IMAGE_URLS.add(src);
				});
		}
	}, [rawImageElRef, src]);
	const isVisible = !isLazy || isIntersected;
	const thumbSrcString =
		src &&
		typeof src === "string" &&
		!(src.startsWith("data:") || src.startsWith("blob:"))
			? getThumbUrl(src!)
			: SMALLEST_GIF;
	const srcString = isVisible ? src : thumbSrcString;

	// 图片缩放逻辑
	const openImage = useCallback(() => {
		const rect = rawImageElRef.current?.getBoundingClientRect();
		if (!rect) return;

		const maxW = window.innerWidth * 0.9;
		const maxH = window.innerHeight * 0.9;
		const s = Math.min(maxW / rect.width, maxH / rect.height, 3);

		const scaledW = rect.width * s;
		const scaledH = rect.height * s;

		const translateX = (window.innerWidth - scaledW) / 2 - rect.left;
		const translateY = (window.innerHeight - scaledH) / 2 - rect.top;
		setIsZoomed(true);
		setTransform({ x: translateX, y: translateY, scale: s });
	}, []);
	const closeImage = useCallback(() => {
		const zoomedImage = zoomedImageRef.current;
		const zoomedOverlay = zoomedOverlayRef.current;
		if (!zoomedImage || !zoomedOverlay) {
			return;
		}
		zoomedImage.style.transform = "none";
		zoomedOverlay.style.opacity = "0";
		delay(300).then(() => {
			setIsZoomed(false);
			setTransform(null);
		});
	}, []);
	// 缩放动画
	useEffect(() => {
		if (!transform || !isZoomed) {
			return;
		}
		const zoomedImage = zoomedImageRef.current;
		if (!zoomedImage) {
			return;
		}
		requestAnimationFrame(() => {
			zoomedImage.style.transform = `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`;
		});
	}, [transform, isZoomed]);
	return (
		<span
			{...stylex.props(
				styles.wrap,
				noTop && styles.noTop,
				noBottom && styles.noBottom
			)}>
			<img
				{...rest}
				style={{
					width: w,
					aspectRatio: ratio,
				}}
				alt={alt}
				ref={rawImageElRef}
				decoding="async"
				src={srcString}
				{...stylex.props(
					styles.img,
					config.optimize.thumb_query && isFullyLoaded ? styles.thumb : null,
					isZoomed ? styles.hidden : inline ? styles.inline : styles.block
				)}
				onLoad={config.optimize.thumb_query ? handleLoad : undefined}
				onClick={openImage}
			/>
			{isZoomed && (
				<span
					{...stylex.props(
						styles.img,
						isZoomed ? styles.hidden : inline ? styles.inline : styles.block
					)}
					style={{
						// eslint-disable-next-line react-hooks/refs
						width: rawImageElRef.current?.getBoundingClientRect()?.width,
						// eslint-disable-next-line react-hooks/refs
						height: rawImageElRef.current?.getBoundingClientRect()?.height,
					}}
				/>
			)}
			{alt && <span {...stylex.props(styles.alt)}>{alt}</span>}
			{isBrowser &&
				createPortal(
					isZoomed && (
						<>
							<div
								ref={zoomedOverlayRef}
								{...stylex.props(styles.overlay)}
								onClick={closeImage}
							/>
							<img
								{...rest}
								style={{
									aspectRatio: ratio,
									// eslint-disable-next-line react-hooks/refs
									left: rawImageElRef.current?.getBoundingClientRect()?.left,
									// eslint-disable-next-line react-hooks/refs
									top: rawImageElRef.current?.getBoundingClientRect()?.top,
									// eslint-disable-next-line react-hooks/refs
									width: rawImageElRef.current?.getBoundingClientRect()?.width,
									height:
										// eslint-disable-next-line react-hooks/refs
										rawImageElRef.current?.getBoundingClientRect()?.height,
									transform: "none",
									opacity: 1,
								}}
								ref={zoomedImageRef}
								alt={alt}
								decoding="async"
								src={src}
								{...stylex.props(styles.zoomed)}
								onClick={closeImage}
							/>
						</>
					),
					document.body,
					"image-zoom-overlay"
				)}
		</span>
	);
}
