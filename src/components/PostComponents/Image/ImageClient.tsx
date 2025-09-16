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
					ref={rawImageElRef}
					decoding="async"
					src={srcString}
					data-zoomable
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
				ref={rawImageElRef}
				decoding="async"
				src={srcString}
				data-zoomable
			/>
			{alt && <span className={style.alt}>{alt}</span>}
		</span>
	);
}
