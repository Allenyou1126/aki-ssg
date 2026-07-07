"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import type { MermaidSource } from "./mermaidRender";

const MermaidRenderer = dynamic(
    async () => {
        const { renderMermaidGraphs } = await import("./mermaidRender");
        return {
            default: function MermaidRendererInner({
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
                    renderMermaidGraphs(sources);
                }, [sources]);

                return <>{children}</>;
            },
        };
    },
    {
        ssr: false,
    },
);

export default function MermaidManagerClient({
    sources,
    children,
}: {
    sources: MermaidSource[];
    children: React.ReactNode;
}) {
    return <MermaidRenderer sources={sources}>{children}</MermaidRenderer>;
}
