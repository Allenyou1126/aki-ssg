import type {
	Element as HastElement,
	ElementContent as HastElementContent,
	Root as HashRoot,
	Node as HastNode,
	RootContent as HastRootContent,
} from "hast";
import { toHtml } from "hast-util-to-html";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import type { Root as MdashRoot } from "mdast";
import { Result, toc } from "mdast-util-toc";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import rehypeMathjax from "rehype-mathjax";
import rehypeSanitize from "rehype-sanitize";
import rehypeHighlight from "rehype-highlight";
import rehypeHighlightCodeLines from "rehype-highlight-code-lines";
import rehypeSlug from "rehype-slug";
import remarkDirective from "remark-directive";
import remarkDirectiveRehype from "remark-directive-rehype";
import remarkGfm from "remark-gfm";
import remarkGithubAlerts from "remark-github-alerts";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { VFile } from "vfile";

const pipeline = unified()
	.use(remarkParse)
	.use(remarkGithubAlerts)
	.use(remarkGfm, { singleTilde: false })
	.use(remarkMath)
	.use(remarkDirective)
	.use(remarkDirectiveRehype)
	.use(remarkRehype, { allowDangerousHtml: true })
	.use(rehypeSlug, {})
	.use(rehypeHighlightCodeLines, {
		showLineNumbers: true,
	})
	.use(rehypeSanitize)
	.use(rehypeMathjax, {})
	.use(rehypeHighlight, {
		plainText: ["plain", "txt", "plaintext"],
	});

function filterNodes(node: HastNode): HastNode | undefined {
	switch (node.type) {
		case "element":
			if ((node as HastElement).tagName === "mjx-container") {
				return {
					type: "element",
					tagName: "span",
					properties: {},
					children: [{ type: "text", value: "[MathJax Expression]" }],
				} as HastElement;
			}
			if ((node as HastElement).tagName === "style") {
				return undefined;
			}
			(node as HastElement).children = (node as HastElement).children
				.map((ch) => filterNodes(ch) as HastElementContent | undefined)
				.filter((v) => v !== undefined);
			return node;
		default:
			return node;
	}
}

function generateForRss(tree: HashRoot): HashRoot {
	tree.children = tree.children
		.map((ch) => filterNodes(ch) as HastRootContent | undefined)
		.filter((v) => v !== undefined);
	return tree;
}

export class MarkdownContent implements RenderableContent {
	hastTree: HashRoot;
	mdastTree: MdashRoot;
	constructor(original: string) {
		const file = new VFile(original);
		this.mdastTree = pipeline.parse(original);
		this.hastTree = pipeline.runSync(this.mdastTree, file);
	}
	toReactNode(): React.ReactNode {
		return (
			this.hastTree &&
			toJsxRuntime(this.hastTree, {
				Fragment,
				components: {},
				ignoreInvalidStyle: true,
				jsx,
				jsxs,
				passNode: true,
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
