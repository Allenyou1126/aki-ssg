/* eslint-disable @next/next/no-img-element */
"use client";
import { config } from "@/data/site-config";
import { getThumbUrl } from "@/utils/getThumbUrl";
import { useIntersection } from "@/utils/useIntersection";
import style from "./style.module.css";

import React, {
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

export default function ImageClient(
	props: JSX.IntrinsicElements["img"] & { inline?: boolean }
) {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { src, ref, decoding, width, height, alt, inline, ...rest } = props;

	// 图片属性
	const w = typeof width! === "number" ? width! : parseInt(width!);
	const h = typeof height! === "number" ? height! : parseInt(height!);
	const ratio = w / h;
	const imageDisplay = inline ? "inline-block" : "block";

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
		<span className={style.wrap}>
			<img
				{...rest}
				style={{
					width: w,
					aspectRatio: ratio,
					display: isZoomed ? "none" : imageDisplay,
				}}
				alt={alt}
				ref={rawImageElRef}
				decoding="async"
				src={srcString}
				className={[
					style.img,
					!config.optimize.thumb_query || isFullyLoaded ? "" : style.thumb,
				].join(" ")}
				onLoad={config.optimize.thumb_query ? handleLoad : undefined}
				onClick={openImage}
			/>
			{isZoomed && (
				<span
					className={style.img}
					style={{
						// eslint-disable-next-line react-hooks/refs
						width: rawImageElRef.current?.getBoundingClientRect()?.width,
						// eslint-disable-next-line react-hooks/refs
						height: rawImageElRef.current?.getBoundingClientRect()?.height,
						display: imageDisplay,
					}}
				/>
			)}
			{alt && <span className={style.alt}>{alt}</span>}
			{isBrowser &&
				createPortal(
					isZoomed && (
						<>
							<div
								ref={zoomedOverlayRef}
								className={style.overlay}
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
								className={style.zoomed}
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
