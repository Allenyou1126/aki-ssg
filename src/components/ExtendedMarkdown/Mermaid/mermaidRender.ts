"use client";

import mermaid from "mermaid";
import type { MermaidResult } from "./mermaidPromise";
import { resolveMermaidPromise } from "./mermaidPromise";

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
    try {
        mermaid.initialize({
            startOnLoad: false,
            theme: "default",
            darkMode: false,
            suppressErrorRendering: true,
        });
        const resLight = await Promise.all(
            source.map(async (item) => {
                try {
                    const svg = await mermaid
                        .render(`mermaid-light-${item.id}`, item.source)
                        .then((res) => res.svg);
                    return {
                        id: item.id,
                        svg,
                        succeed: true,
                    } satisfies RenderResult;
                } catch (error) {
                    return {
                        id: item.id,
                        succeed: false,
                        error,
                    } satisfies RenderResult;
                }
            }),
        );
        mermaid.initialize({
            startOnLoad: false,
            theme: "dark",
            darkMode: true,
            suppressErrorRendering: true,
        });
        const resDark = await Promise.all(
            source.map(async (item) => {
                try {
                    const svg = await mermaid
                        .render(`mermaid-dark-${item.id}`, item.source)
                        .then((res) => res.svg);
                    return {
                        id: item.id,
                        svg,
                        succeed: true,
                    } satisfies RenderResult;
                } catch (error) {
                    return {
                        id: item.id,
                        succeed: false,
                        error,
                    } satisfies RenderResult;
                }
            }),
        );
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
