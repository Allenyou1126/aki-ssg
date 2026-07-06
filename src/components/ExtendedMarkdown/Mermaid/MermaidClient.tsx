"use client";

import * as stylex from "@stylexjs/stylex";
import { useAtomValue } from "jotai";
import { startTransition, useCallback, useEffect, useState } from "react";
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

    const renderMermaid = useCallback(async (): Promise<
        | { succeed: true; res: string; resDark: string }
        | { succeed: false; err: unknown }
    > => {
        try {
            mermaid.initialize({
                startOnLoad: false,
                suppressErrorRendering: true,
                theme: "default",
            });
            const res = await mermaid.render("mermaid", children);
            mermaid.initialize({
                startOnLoad: false,
                suppressErrorRendering: true,
                theme: "dark",
            });
            const resDark = await mermaid.render("mermaid-dark", children);
            return { succeed: true, res: res.svg, resDark: resDark.svg };
        } catch (err) {
            return { succeed: false, err };
        }
    }, [children]);

    const updateRenderResult = useCallback(
        (
            res:
                | { succeed: true; res: string; resDark: string }
                | { succeed: false; err: unknown },
        ) => {
            if (res.succeed) {
                setRenderState("success");
                setRenderResult(res.res);
                setRenderResultDark(res.resDark);
            } else {
                setRenderState("failed");
                console.log(res.err);
            }
        },
        [],
    );

    useEffect(() => {
        renderMermaid().then((res) => {
            startTransition(() => {
                updateRenderResult(res);
            });
        });

        return () => {
            startTransition(() => {
                setRenderState("rendering");
                setRenderResult("");
                setRenderResultDark("");
            });
        };
    }, [children, renderMermaid, updateRenderResult]);

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
