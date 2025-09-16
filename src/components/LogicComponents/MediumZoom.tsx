"use client";

import { useEffect } from "react";

import mediumZoom from "medium-zoom";
import { usePathname } from "next/navigation";

export default function MediumZoom() {
	const pathname = usePathname();
	useEffect(() => {
		const zoom = mediumZoom({
			background: "rgba(0, 0, 0, 0.3)",
		});
		zoom.attach("[data-zoomable]");
		return () => {
			zoom.detach();
		};
	}, [pathname]);
	return <></>;
}
