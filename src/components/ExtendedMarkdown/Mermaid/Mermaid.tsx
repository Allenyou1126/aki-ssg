"use client";

import * as stylex from "@stylexjs/stylex";
import { useAtomValue } from "jotai";
import useSWR from "swr";
import { MermaidLoading } from "./MermaidLoading";
import { Paragraph } from "@/components/PostComponents/Paragraph";
import { isDarkMode } from "@/libs/state-management";
import { getMermaidRenderPromise } from "./mermaidPromise";
import type { MermaidResult } from "./mermaidPromise";

const MERMAID_KEY_PREFIX = "mermaid:";

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

const mermaidFetcher = async (key: string): Promise<MermaidResult> => {
	const results = await getMermaidRenderPromise();
    const id = key.slice(MERMAID_KEY_PREFIX.length);
    const result = results.get(id);
    if (!result || !result.succeed) {
        throw new Error(result?.error?.toString() ?? "Mermaid 图表渲染失败");
    }
    return result;
};

export function Mermaid({
    "data-mermaid-id": dataMermaidId,
}: {
    "data-mermaid-id"?: string;
}) {
    const darkMode = useAtomValue(isDarkMode);

    const { data: mermaidResult, error, isLoading } = useSWR(
        dataMermaidId ? `${MERMAID_KEY_PREFIX}${dataMermaidId}` : null,
        mermaidFetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            revalidateIfStale: false,
        },
    );

    if (!dataMermaidId) {
        return (
            <Paragraph>
                <span {...stylex.props(style.error)}>
                    Mermaid 图表 ID 缺失。
                </span>
            </Paragraph>
        );
    }

    if (isLoading) {
        return <MermaidLoading />;
    }

	if (error || !mermaidResult || !mermaidResult.succeed) {
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
                __html: darkMode ? mermaidResult.resDark : mermaidResult.res,
            }}
            {...stylex.props(style.container)}
        />
    );
}
