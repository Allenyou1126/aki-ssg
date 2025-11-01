import type { Root as HashRoot } from "hast";

import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { html_components } from "@/libs/markdown-components";
import { htmlPipeline } from "@/libs/markdown-render";
import { fromHtml } from "hast-util-from-html";

export function fromHtmlToNodes(src: string): React.ReactNode {
	const raw = fromHtml(src) as HashRoot;
	const hast = htmlPipeline.runSync(raw);
	return toJsxRuntime(hast, {
		Fragment,
		components: {
			...html_components,
		},
		ignoreInvalidStyle: true,
		jsx,
		jsxs,
	});
}
