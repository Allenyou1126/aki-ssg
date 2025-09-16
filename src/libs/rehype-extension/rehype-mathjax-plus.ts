/* eslint-disable @typescript-eslint/no-explicit-any */
import { visit } from "unist-util-visit";
import type { Root } from "hast";

export const rehypeMathjaxPlus = () => (tree: Root) => {
	visit(tree, "element", (node: any) => {
		if (node.tagName !== "mjx-container") {
			return;
		}
		node.children?.forEach((child: any) => {
			if (child.type === "element" && child.tagName === "svg") {
				child.properties.style = {
					...child.properties.style,
					display: "inline",
					"vertical-align": "middle",
				};
			}
		});
	});
	return tree;
};
