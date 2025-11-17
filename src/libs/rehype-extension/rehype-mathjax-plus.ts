import type { Root } from "hast";
import * as stylex from "@stylexjs/stylex";
import { selectAll } from "hast-util-select";
import { visit } from "unist-util-visit";

const style = stylex.create({
	math: {
		display: "inline",
		verticalAlign: "middle",
	},
});

export const rehypeMathjaxPlus = () => (tree: Root) => {
	selectAll("mjx-container > svg", tree).forEach((node) => {
		node.properties.className = stylex.props(style.math).className;
	});
	return tree;
};

export const rehypeMathjaxRss = () => (tree: Root) => {
	visit(tree, (node) => {
		if (node.type !== "element" || node.tagName !== "pre") {
			return;
		}
		if (
			!node.children.some((c) => c.type === "element" && c.tagName === "code")
		) {
			return;
		}
		if (
			node.children
				.filter((c) => c.type === "element" && c.tagName === "code")
				.some((c) => {
					if (c.type !== "element" || c.tagName !== "code") {
						return false;
					}
					const className = c.properties?.className;
					if (!className) {
						return false;
					}
					if (!Array.isArray(className)) {
						return className.toString() === "language-math";
					}
					return className.map((s) => s.toString()).includes("language-math");
				})
		) {
			node.tagName = "p";
			node.children = [
				{
					type: "text",
					value: "[MathJax Expression]",
				},
			];
			node.properties = {};
		}
	});
	selectAll("code.language-math", tree).forEach((node) => {
		node.tagName = "span";
		node.children = [
			{
				type: "text",
				value: "[MathJax Expression]",
			},
		];
		node.properties = {};
	});
	return tree;
};
