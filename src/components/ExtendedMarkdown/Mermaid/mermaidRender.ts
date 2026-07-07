"use client";

import mermaid from "mermaid";
import type { MermaidResult } from "./mermaidPromise";
import { resolveMermaidPromise } from "./mermaidPromise";

console.log("[mermaid] module loaded");

export type MermaidSource = {
    id: string;
    source: string;
};

type RenderResult =
    | {
          id: string;
          succeed: true;
          svg: string;
      }
    | {
          id: string;
          succeed: false;
          error: unknown;
      };

export async function renderMermaidGraphs(
    source: MermaidSource[],
): Promise<Map<string, MermaidResult>> {
    console.log("[mermaid] renderMermaidGraphs called, count:", source.length);
    try {
        console.log("[mermaid] before initialize");
        mermaid.initialize({
            startOnLoad: false,
            theme: "default",
            darkMode: false,
            suppressErrorRendering: true,
        });
        console.log("[mermaid] after initialize, starting resLight");
        const resLight = await Promise.all(
            source.map(async (item) => {
                try {
                    console.log("[mermaid] rendering light:", item.id);
                    const svg = await mermaid
                        .render(`mermaid-light-${item.id}`, item.source)
                        .then((res) => res.svg);
                    console.log("[mermaid] done light:", item.id);
                    return {
                        id: item.id,
                        svg,
                        succeed: true,
                    } satisfies RenderResult;
                } catch (error) {
                    console.error("[mermaid] light render failed:", item.id, error);
                    return {
                        id: item.id,
                        succeed: false,
                        error,
                    } satisfies RenderResult;
                }
            }),
        );
        console.log("[mermaid] resLight done, starting resDark");
        mermaid.initialize({
            startOnLoad: false,
            theme: "dark",
            darkMode: true,
            suppressErrorRendering: true,
        });
        console.log("[mermaid] dark init done");
        const resDark = await Promise.all(
            source.map(async (item) => {
                try {
                    console.log("[mermaid] rendering dark:", item.id);
                    const svg = await mermaid
                        .render(`mermaid-dark-${item.id}`, item.source)
                        .then((res) => res.svg);
                    console.log("[mermaid] done dark:", item.id);
                    return {
                        id: item.id,
                        svg,
                        succeed: true,
                    } satisfies RenderResult;
                } catch (error) {
                    console.error("[mermaid] dark render failed:", item.id, error);
                    return {
                        id: item.id,
                        succeed: false,
                        error,
                    } satisfies RenderResult;
                }
            }),
        );
        console.log("[mermaid] resDark done, building result map");
        const resMap = new Map<string, RenderResult>();
        const resDarkMap = new Map<string, RenderResult>();
        resLight.forEach((item) => {
            resMap.set(item.id, item);
        });
        resDark.forEach((item) => {
            resDarkMap.set(item.id, item);
        });
        const ret = new Map<string, MermaidResult>();
        source.forEach((item) => {
            const res = resMap.get(item.id);
            const resDark = resDarkMap.get(item.id);
            if (!res) {
                ret.set(item.id, {
                    succeed: false,
                    error: new Error("Light graph rendering error"),
                });
                return;
            }
            if (!resDark) {
                ret.set(item.id, {
                    succeed: false,
                    error: new Error("Dark graph rendering error"),
                });
                return;
            }
            if (!res.succeed) {
                ret.set(item.id, {
                    succeed: false,
                    error: res.error,
                });
                return;
            }
            if (!resDark.succeed) {
                ret.set(item.id, {
                    succeed: false,
                    error: resDark.error,
                });
                return;
            }
            ret.set(item.id, {
                succeed: true,
                res: res.svg,
                resDark: resDark.svg,
            });
        });
        console.log("[mermaid] resolving promise with", ret.size, "results");
        resolveMermaidPromise(ret);
        return ret;
    } catch (err) {
        console.error("Mermaid batch rendering failed:", err);
        const errorMap = new Map<string, MermaidResult>();
        for (const item of source) {
            errorMap.set(item.id, { succeed: false, error: err });
        }
        resolveMermaidPromise(errorMap);
        return errorMap;
    }
}
