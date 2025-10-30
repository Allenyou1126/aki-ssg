/* eslint-disable @typescript-eslint/no-explicit-any */
import { visit } from "unist-util-visit";
import type { Root } from "hast";
import * as stylex from "@stylexjs/stylex";

const style = stylex.create({
	math: {
		display: "inline",
		verticalAlign: "middle",
	},
});

export const rehypeMathjaxPlus = () => (tree: Root) => {
	visit(tree, "element", (node: any) => {
		if (node.tagName !== "mjx-container") {
			return;
		}
		node.children?.forEach((child: any) => {
			if (child.type === "element" && child.tagName === "svg") {
				child.properties.className = stylex.props(style.math).className;
			}
		});
	});
	return tree;
};
