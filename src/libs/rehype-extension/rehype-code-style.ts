/* eslint-disable @typescript-eslint/no-explicit-any */
import { visit } from "unist-util-visit";
import type { Root } from "hast";

export const rehypeCodeStyle = () => (tree: Root) => {
	visit(tree, "element", (node: any) => {
		if (!node.children) {
			return;
		}
		if (node.tagName !== "pre") {
			return;
		}
		node.children?.forEach((child: any) => {
			if (child.type !== "element") {
				return;
			}
			child.properties.parent = "pre";
		});
	});
	return tree;
};
