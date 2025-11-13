import type {
	Element as HastElement,
	ElementContent as HastElementContent,
	Root as HashRoot,
	Node as HastNode,
	RootContent as HastRootContent,
} from "hast";
import { unified } from "unified";

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

import { remarkBilibili } from "@/libs/markdown-extension/remark-bilibili";
import { remarkFriendLinks } from "@/libs/markdown-extension/remark-friend-links";
import { remarkChat } from "@/libs/markdown-extension/remark-chat";
import { remarkMeme } from "@/libs/markdown-extension/remark-meme";
import { rehypeMathjaxPlus } from "@/libs/rehype-extension/rehype-mathjax-plus";
import { rehypeTypographyFirstLastChild } from "@/libs/rehype-extension/rehype-typography-first-last-child";
import { rehypeRemoveBreakline } from "@/libs/rehype-extension/rehype-remove-breakline";
import { rehypeListStyle } from "@/libs/rehype-extension/rehype-list-style";
import { rehypeTableStyle } from "@/libs/rehype-extension/rehype-table-style";
import { rehypeCodeStyle } from "@/libs/rehype-extension/rehype-code-style";
import { rehypeHeaderStyle } from "@/libs/rehype-extension/rehype-header-style";
import { rehypeBlockquoteStyle } from "@/libs/rehype-extension/rehype-blockquote-style";

export const markdownPipeline = unified()
	.use(remarkParse)
	.use(remarkGithubAlerts)
	.use(remarkGfm, { singleTilde: false })
	.use(remarkMath)
	.use(remarkDirective)
	.use(remarkDirectiveRehype)
	.use(remarkBilibili)
	.use(remarkMeme)
	.use(remarkChat)
	.use(remarkFriendLinks)
	.use(remarkRehype);

export const htmlPipeline = unified()
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

function filterNodes(node: HastNode): HastNode | undefined {
	switch (node.type) {
		case "element":
			const ele = node as HastElement;
			if (ele.tagName === "mjx-container") {
				return {
					type: "element",
					tagName: "span",
					properties: {},
					children: [{ type: "text", value: "[MathJax Expression]" }],
				} as HastElement as HastNode;
			}
			if (ele.tagName === "style") {
				return undefined;
			}
			ele.children = ele.children
				.map(
					(ch) => filterNodes(ch as HastNode) as HastElementContent | undefined
				)
				.filter((v) => v !== undefined);
			return node;
		default:
			return node;
	}
}

export function generateForRss(tree: HashRoot): HashRoot {
	tree.children = tree.children
		.map((ch) => filterNodes(ch as HastNode) as HastRootContent | undefined)
		.filter((v) => v !== undefined);
	return tree;
}
