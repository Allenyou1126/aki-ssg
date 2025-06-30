/* eslint-disable @next/next/no-img-element */
"use client";
import { config } from "@/data/site-config";
import { getThumbUrl } from "@/utils/getThumbUrl";
import { useIntersection } from "@/utils/useIntersection";
import mediumZoom, { Zoom } from "medium-zoom";
import "@/styles/content.css";
import style from "./style.module.css";

import React, {
	useRef,
	useMemo,
	useLayoutEffect,
	RefCallback,
	useCallback,
	useState,
	JSX,
} from "react";

const LOADED_IMAGE_URLS = new Set<string>();

const SMALLEST_GIF =
	"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

export default function ImageClient(
	props: JSX.IntrinsicElements["img"] & { inline?: boolean }
) {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { src, ref, decoding, width, height, alt, inline, ...rest } = props;
	const rawImageElRef = useRef<HTMLImageElement>(null);
	const previousSrcRef = useRef<string | Blob | undefined>(src);
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
	const zoomRef = useRef<Zoom | null>(null);
	const getZoom = useCallback(() => {
		if (zoomRef.current === null) {
			zoomRef.current = mediumZoom({
				background: "rgb(0, 0, 0, 0.3)",
			});
		}
		return zoomRef.current;
	}, []);
	const imageElRef: RefCallback<HTMLImageElement> = (node) => {
		(rawImageElRef as React.RefObject<HTMLImageElement | null>).current = node;
		if (ref !== null && ref !== undefined && typeof ref !== "string") {
			if (typeof ref === "function") {
				ref(node);
			} else if (ref !== null) {
				(ref as React.RefObject<HTMLImageElement | null>).current = node;
			}
		}
		const zoom = getZoom();
		if (node) {
			zoom.attach(node);
		} else {
			zoom.detach();
		}
	};
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
	const w = typeof width! === "number" ? width! : parseInt(width!);
	const h = typeof height! === "number" ? height! : parseInt(height!);
	const ratio = w / h;
	if (!config.optimize.thumb_query) {
		return (
			<span className={style.wrap}>
				<img
					{...rest}
					style={{
						width: w,
						aspectRatio: ratio,
						display: inline ? "inline-block" : "block",
					}}
					className={style.img}
					width={w}
					height={h}
					alt={alt}
					ref={imageElRef}
					decoding="async"
					src={srcString}
				/>
				{alt && <span className={style.alt}>{alt}</span>}
			</span>
		);
	}
	return (
		<span className={style.wrap}>
			<img
				{...rest}
				style={{
					width: w,
					aspectRatio: ratio,
					display: inline ? "inline-block" : "block",
				}}
				className={[style.img, isFullyLoaded ? "" : style.thumb].join(" ")}
				alt={alt}
				onLoad={handleLoad}
				ref={imageElRef}
				decoding="async"
				src={srcString}
			/>
			{alt && <span className={style.alt}>{alt}</span>}
		</span>
	);
}
