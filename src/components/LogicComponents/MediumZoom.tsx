// ImageZoom.jsx
"use client";

import { useEffect } from "react";
import style from "@/components/PostComponents/Image/style.module.css";
import { usePathname } from "next/navigation";

export default function ImageZoom() {
	const pathname = usePathname();
	useEffect(() => {
		function handleImageClick(img: HTMLImageElement) {
			if (document.querySelector(".image-zoom-overlay")) {
				return;
			}

			const rect = img.getBoundingClientRect();

			const overlay = document.createElement("div");
			overlay.className = ["image-zoom-overlay", style.overlay].join(" ");
			Object.assign(overlay.style);

			const placeholder = document.createElement("div");
			Object.assign(placeholder.style, {
				width: rect.width + "px",
				height: rect.height + "px",
				display: "inline-block",
			});

			const clone = img.cloneNode(true) as HTMLImageElement;
			clone.className = ["image-zoom-clone", style.expanded].join(" ");
			Object.assign(clone.style, {
				left: rect.left + "px",
				top: rect.top + "px",
				width: rect.width + "px",
				height: rect.height + "px",
				transform: "none",
				opacity: "1",
			});

			document.body.appendChild(overlay);
			document.body.appendChild(clone);
			img.parentNode?.insertBefore(placeholder, img);
			img.style.display = "none";

			requestAnimationFrame(() => {
				const maxWidth = window.innerWidth * 0.9;
				const maxHeight = window.innerHeight * 0.9;
				const scale = Math.min(
					maxWidth / rect.width,
					maxHeight / rect.height,
					3
				);

				const scaledWidth = rect.width * scale;
				const scaledHeight = rect.height * scale;

				const translateX = (window.innerWidth - scaledWidth) / 2 - rect.left;
				const translateY = (window.innerHeight - scaledHeight) / 2 - rect.top;
				clone.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
			});

			const closeImage = () => {
				clone.style.transform = "none";
				overlay.style.opacity = "0";

				setTimeout(() => {
					img.style.display = "";
					placeholder.remove();
					clone.remove();
					overlay.remove();
				}, 300);
			};

			clone.onclick = closeImage;
			overlay.onclick = closeImage;
		}

		const images = document.querySelectorAll(
			"img[data-zoomable]"
		) as NodeListOf<HTMLImageElement>;
		images.forEach((img) => {
			img.removeEventListener("click", () => handleImageClick(img));
			img.addEventListener("click", () => handleImageClick(img));
		});

		return () => {
			images.forEach((img) => {
				img.removeEventListener("click", () => handleImageClick(img));
			});
		};
	}, [pathname]);

	return null;
}
