"use client";

import * as stylex from "@stylexjs/stylex";
import { useAtomValue } from "jotai";
import { useCallback, useEffect, useState } from "react";
import mermaid from "mermaid";
import { MermaidLoading } from "./MermaidLoading";
import { Paragraph } from "@/components/PostComponents/Paragraph";
import { isDarkMode } from "@/libs/state-management";

const style = stylex.create({
    error: {
        color: "red",
    },
    container: {
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "center",
        fontSize: 0,
        height: "auto",
        marginBottom: "0.25rem",
        marginLeft: 0,
        marginRight: 0,
        marginTop: 0,
        maxWidth: "100%",
        position: "relative",
        width: "100%",
        textAlign: "center",
    },
});

export default function MermaidClient({ children }: { children: string }) {
    const [renderState, setRenderState] = useState<
        "rendering" | "success" | "failed"
    >("rendering");
    const darkMode = useAtomValue(isDarkMode);
    const [renderResult, setRenderResult] = useState<string>("");
    const [renderResultDark, setRenderResultDark] = useState<string>("");

    const renderMermaid = useCallback(async () => {
        try {
            mermaid.initialize({
                startOnLoad: false,
                suppressErrorRendering: true,
                theme: "default",
            });
            await mermaid.render("mermaid", children).then((res) => {
                setRenderResult(res.svg);
            });
            mermaid.initialize({
                startOnLoad: false,
                suppressErrorRendering: true,
                theme: "dark",
            });
            await mermaid.render("mermaid-dark", children).then((res) => {
                setRenderResultDark(res.svg);
            });
            setRenderState("success");
        } catch (err) {
            setRenderState("failed");
            console.error(err);
        }
    }, [children]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        renderMermaid();

        return () => {
            setRenderState("rendering");
            setRenderResult("");
            setRenderResultDark("");
        };
    }, [children, renderMermaid]);

    if (renderState === "rendering") {
        return <MermaidLoading />;
    }
    if (renderState === "failed") {
        return (
            <Paragraph>
                <span {...stylex.props(style.error)}>
                    Mermaid 图表渲染失败。
                </span>
            </Paragraph>
        );
    }
    return (
        <div
            dangerouslySetInnerHTML={{
                __html: darkMode ? renderResultDark : renderResult,
            }}
            {...stylex.props(style.container)}
        />
    );
}
