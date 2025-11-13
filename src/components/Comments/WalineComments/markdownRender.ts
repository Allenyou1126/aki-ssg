import type { Root as HashRoot } from "hast";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { html_components } from "@/libs/markdown-components";
import { fromHtml } from "hast-util-from-html";
import { unified } from "unified";
import { rehypeTypographyFirstLastChild } from "@/libs/rehype-extension/rehype-typography-first-last-child";
import { rehypeRemoveBreakline } from "@/libs/rehype-extension/rehype-remove-breakline";
import { rehypeTableStyle } from "@/libs/rehype-extension/rehype-table-style";
import { rehypeListStyle } from "@/libs/rehype-extension/rehype-list-style";
import { rehypeCodeStyle } from "@/libs/rehype-extension/rehype-code-style";
import { rehypeHeaderStyle } from "@/libs/rehype-extension/rehype-header-style";
import { rehypeBlockquoteStyle } from "@/libs/rehype-extension/rehype-blockquote-style";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeMathjax from "rehype-mathjax";
import { rehypeMathjaxPlus } from "@/libs/rehype-extension/rehype-mathjax-plus";
import rehypeHighlight from "rehype-highlight";
import { selectAll } from "hast-util-select";
import { CodeSpan } from "./CodeSpan";

const rehypeLowlightCodeStyle = () => (tree: HashRoot) => {
	selectAll("pre code span", tree).forEach((node) => {
		if (node.type !== "element" || node.tagName !== "span") {
			return;
		}
		if (
			node.properties.className === undefined ||
			node.properties.className === null
		) {
			return;
		}
		const classNames = (
			Array.isArray(node.properties.className)
				? node.properties.className
				: [node.properties.className]
		)
			.map((v) => v.toString())
			.filter((v) => v.startsWith("hljs-"))
			.map((v) => v.replace("hljs-", ""));
		node.properties.className = undefined;
		node.properties.tags = classNames;
		node.tagName = "hljs-span";
	});
	return tree;
};

const htmlPipeline = unified()
	.use(rehypeTypographyFirstLastChild)
	.use(rehypeRemoveBreakline)
	.use(rehypeTableStyle)
	.use(rehypeListStyle)
	.use(rehypeCodeStyle)
	.use(rehypeHeaderStyle)
	.use(rehypeBlockquoteStyle)
	.use(rehypeSanitize, {
		tagNames: [
			"mjx-container",
			"svg",
			"path",
			"g",
			"defs",
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
		},
	})
	.use(rehypeMathjax, {})
	.use(rehypeMathjaxPlus)
	.use(rehypeHighlight, {
		plainText: ["plain", "txt", "plaintext"],
	})
	.use(rehypeLowlightCodeStyle);

export function fromHtmlToNodes(src: string): React.ReactNode {
	const raw = fromHtml(src, {
		fragment: true,
	}) as HashRoot;
	const hast = htmlPipeline.runSync(raw);
	return toJsxRuntime(hast, {
		Fragment,
		components: {
			...html_components,
			"hljs-span": CodeSpan,
		},
		ignoreInvalidStyle: true,
		jsx,
		jsxs,
	});
}
