"use client";
import dynamic from "next/dynamic";
import { MermaidLoading } from "./MermaidLoading";

export const Mermaid = dynamic(async () => import("./MermaidClient"), {
    ssr: false,
    loading: () => {
        return <MermaidLoading />;
    },
});
