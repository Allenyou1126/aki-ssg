import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { VFile } from "vfile";
import { html_components } from "@/libs/markdown-components";
import { extended_components } from "@/libs/markdown-extension/extended-markdown-components";
import {
	markdownPipeline,
	generateForRss,
	htmlPipeline,
} from "@/libs/markdown-render";
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
	hastTree: HashRoot | null = null;
	mdastTree: MdashRoot | null = null;
	original: string;
	constructor(original: string) {
		this.original = original;
	}
	async render() {
		const file = new VFile(this.original);
		this.mdastTree = markdownPipeline.parse(this.original);
		const rawHastTree = await markdownPipeline.run(this.mdastTree, file);
		this.hastTree = await htmlPipeline.run(rawHastTree, file);
	}
	toReactNode(): React.ReactNode {
		if (!this.hastTree) {
			throw new Error("Markdown content has not been rendered yet.");
		}
		return toJsxRuntime(this.hastTree, {
			Fragment,
			components: {
				...post_components,
				...html_components,
				...extended_components,
			},
			ignoreInvalidStyle: true,
			jsx,
			jsxs,
		});
	}
	toToc(): Result {
		if (!this.mdastTree) {
			throw new Error("Markdown content has not been rendered yet.");
		}
		return toc(this.mdastTree, {
			tight: true,
			ordered: true,
		});
	}
	toRssFeed(): string {
		if (!this.hastTree) {
			throw new Error("Markdown content has not been rendered yet.");
		}
		return toHtml(generateForRss(this.hastTree), {});
	}
}
