import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { VFile } from "vfile";
import { html_components } from "./markdown-components";
import { extended_components } from "./markdown-extension/extended-markdown-components";
import {
	markdownPipeline,
	generateForRss,
	htmlPipeline,
} from "./markdown-render";
import type { Root as HashRoot } from "hast";
import type { Root as MdashRoot } from "mdast";
import type { Result } from "mdast-util-toc";
import { toc } from "mdast-util-toc";
import { toHtml } from "hast-util-to-html";

import Image from "@/components/PostComponents/Image/Image";

export const post_components = {
	img: Image,
};

export class MarkdownContent implements RenderableContent {
	hastTree: HashRoot;
	mdastTree: MdashRoot;
	constructor(original: string) {
		const file = new VFile(original);
		this.mdastTree = markdownPipeline.parse(original);
		const rawHastTree = markdownPipeline.runSync(this.mdastTree, file);
		this.hastTree = htmlPipeline.runSync(rawHastTree, file);
	}
	toReactNode(): React.ReactNode {
		return (
			this.hastTree &&
			toJsxRuntime(this.hastTree, {
				Fragment,
				components: {
					...post_components,
					...html_components,
					...extended_components,
				},
				ignoreInvalidStyle: true,
				jsx,
				jsxs,
			})
		);
	}
	toToc(): Result {
		return (
			this.mdastTree &&
			toc(this.mdastTree, {
				tight: true,
				ordered: true,
			})
		);
	}
	toRssFeed(): string {
		return this.hastTree && toHtml(generateForRss(this.hastTree), {});
	}
}
