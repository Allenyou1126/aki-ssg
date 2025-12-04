import type { Root as HashRoot } from "hast";
import { unified } from "unified";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { html_components } from "@/libs/markdown-components";
import { extended_components } from "@/libs/markdown-extension/extended-markdown-components";
import type { Root as MdashRoot } from "mdast";
import type { Result } from "mdast-util-toc";
import { toc } from "mdast-util-toc";
import { toHtml } from "hast-util-to-html";

import Image from "@/components/PostComponents/Image/Image";
import { ShikiSpan } from "@/components/PostComponents/ShikiSpan";

import { removePosition } from "unist-util-remove-position";
import { remove } from "unist-util-remove";
import { find } from "unist-util-find";

import rehypeMathjax from "rehype-mathjax";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeShiki from "@shikijs/rehype";
import rehypeSlug from "rehype-slug";
import remarkDirective from "remark-directive";
import remarkDirectiveRehype from "remark-directive-rehype";
import remarkGfm from "remark-gfm";
import remarkGithubAlerts from "remark-github-alerts";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkFrontmatter from "remark-frontmatter";

import { remarkBilibili } from "@/libs/markdown-extension/remark-bilibili";
import { remarkFriendLinks } from "@/libs/markdown-extension/remark-friend-links";
import { remarkChat } from "@/libs/markdown-extension/remark-chat";
import { remarkMeme } from "@/libs/markdown-extension/remark-meme";
import {
	rehypeMathjaxPlus,
	rehypeMathjaxRss,
} from "@/libs/rehype-extension/rehype-mathjax-plus";
import { rehypeTypographyFirstLastChild } from "@/libs/rehype-extension/rehype-typography-first-last-child";
import { rehypeRemoveBreakline } from "@/libs/rehype-extension/rehype-remove-breakline";
import { rehypeListStyle } from "@/libs/rehype-extension/rehype-list-style";
import { rehypeTableStyle } from "@/libs/rehype-extension/rehype-table-style";
import { rehypeCodeStyle } from "@/libs/rehype-extension/rehype-code-style";
import { rehypeHeaderStyle } from "@/libs/rehype-extension/rehype-header-style";
import { rehypeBlockquoteStyle } from "@/libs/rehype-extension/rehype-blockquote-style";
import jsYaml from "js-yaml";

import * as zc from "zod/v4/core";

const markdownPipeline = unified()
	.use(remarkParse)
	.use(remarkFrontmatter, ["yaml"])
	.use(remarkGithubAlerts)
	.use(remarkGfm, { singleTilde: false })
	.use(remarkMath)
	.use(remarkDirective)
	.use(remarkDirectiveRehype)
	.use(remarkBilibili)
	.use(remarkMeme)
	.use(remarkChat)
	.use(remarkFriendLinks);

const remarkRehypePipeline = unified().use(remarkRehype);

const htmlPipeline = unified()
	.use(rehypeSlug, {})
	.use(rehypeShiki, {
		theme: "night-owl",
	})
	.use(rehypeCodeStyle)
	.use(rehypeTypographyFirstLastChild)
	.use(rehypeRemoveBreakline)
	.use(rehypeTableStyle)
	.use(rehypeListStyle)
	.use(rehypeHeaderStyle)
	.use(rehypeBlockquoteStyle)
	.use(rehypeSanitize, {
		tagNames: [
			"bilibili",
			"friend-links",
			"chat",
			"chat-item",
			"chat-sender",
			"meme",
			"mjx-container",
			"svg",
			"path",
			"g",
			"defs",
			"shiki-span",
			...(defaultSchema.tagNames ?? []),
		],
		attributes: {
			// HTML Components
			"*": ["noTop", "noBottom", "id"],
			a: ["href"],
			img: ["src", "width", "height", "alt", "inline"],
			code: [["className", /^language-/], "parent"],
			kbd: ["parent"],
			p: ["parent", "first", "last"],
			strong: ["parent"],
			th: ["first", "last"],
			tr: ["last"],
			td: ["first", "last", "parent"],
			ol: ["type", "parent"],
			ul: ["parent"],
			"shiki-span": ["style"],
			// Custom elements
			chat: [],
			"chat-item": ["sender_name", "sender_avatar", "align_right"],
			"chat-sender": ["sender_name", "sender_avatar", "align_right"],
			bilibili: ["bvid", "cid"],
			meme: ["group", "mid"],
		},
	})
	.use(rehypeMathjax, {})
	.use(rehypeMathjaxPlus);

const rssPipeline = unified()
	.use(rehypeSlug, {})
	.use(rehypeMathjaxRss)
	.use(rehypeSanitize, {
		attributes: {
			"*": ["id"],
			a: ["href"],
			img: ["src", "width", "height", "alt"],
			code: [["className", /^language-/]],
		},
	});

const post_components = {
	img: Image,
	"shiki-span": ShikiSpan,
};

export class MarkdownContent implements RenderableContent {
	hastTree: HashRoot | null = null;
	mdastTree: MdashRoot | null = null;
	rssHastTree: HashRoot | null = null;
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
		if (!this.rssHastTree) {
			throw new Error("Markdown content has not been rendered yet.");
		}
		return toHtml(this.rssHastTree, {});
	}
}

export async function renderMarkdownContent<T extends zc.$ZodObject>(
	src: string,
	metadataSchema: T
): Promise<zc.output<T> & Content> {
	const content = new MarkdownContent();
	const mdastTree = await markdownPipeline.run(markdownPipeline.parse(src));
	const fmNode = find<{ type: "yaml"; value?: string }>(mdastTree, {
		type: "yaml",
	});
	if (!fmNode) {
		throw new Error("Frontmatter not found.");
	}
	const fmData = fmNode.value;
	if (!fmData) {
		throw new Error("Frontmatter data is empty.");
	}
	const rawFmData = jsYaml.load(fmData);
	const metadata = await zc.parseAsync(metadataSchema, rawFmData);
	remove(mdastTree, { type: "yaml" });
	content.mdastTree = mdastTree;
	const rawHastTree = await remarkRehypePipeline.run(mdastTree);
	removePosition(rawHastTree, {
		force: true,
	});
	content.hastTree = await htmlPipeline.run(
		JSON.parse(JSON.stringify(rawHastTree))
	);
	content.rssHastTree = await rssPipeline.run(
		JSON.parse(JSON.stringify(rawHastTree))
	);
	return {
		...metadata,
		original_content: src,
		markdown_content: content,
	};
}
