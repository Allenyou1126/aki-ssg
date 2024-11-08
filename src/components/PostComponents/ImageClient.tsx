/* eslint-disable @next/next/no-img-element */
"use client";
import { config } from "@/data/site-config";
import { connectString } from "@/utils/connectString";
import { getThumbUrl } from "@/utils/getThumbUrl";
import { useIntersection } from "@/utils/useIntersection";
import mediumZoom, { Zoom } from "medium-zoom";

import React, {
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
						if (!imageElRef.current) return;
						LOADED_IMAGE_URLS.add(srcString);
						setIsFullyLoaded(true);
					});
			}
		}
	}, [imageElRef, srcString]);
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
	const { src, className, ref, decoding, width, height, alt, ...rest } = props; // eslint-disable-line @typescript-eslint/no-unused-vars
	const rawImageElRef = useRef<HTMLImageElement>(null);
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
		(rawImageElRef as React.MutableRefObject<HTMLImageElement | null>).current =
			node;
		if (ref !== null && ref !== undefined && typeof ref !== "string") {
			if (typeof ref === "function") {
				ref(node);
			} else if (ref !== null) {
				(ref as React.MutableRefObject<HTMLImageElement | null>).current = node;
			}
		}
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
					className == null ? "" : className,
				])}
				alt={alt}
				ref={imageElRef}
				decoding="async"
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
					"border-box p-0 border-0 m-auto block cursor-zoom-in zoomable",
					isImageFullyLoaded ? "" : "bg-primary/60",
					props.className == null ? "" : props.className,
				])}
				alt={alt}
				ref={imageElRef}
				decoding="async"
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
