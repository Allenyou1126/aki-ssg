"use client";

import { useEffect, useRef } from "react";
import { renderMermaidGraphs } from "./mermaidRender";
import type { MermaidSource } from "./mermaidRender";

export default function MermaidManagerClient({
	sources,
	children,
}: {
	sources: MermaidSource[];
	children: React.ReactNode;
}) {
	const hasRendered = useRef(false);

	useEffect(() => {
		if (hasRendered.current) return;
		hasRendered.current = true;
		renderMermaidGraphs(sources).catch((err) => {
			console.error("[MermaidManagerClient] renderMermaidGraphs rejected:", err);
		});
	}, [sources]);

	return <>{children}</>;
}
