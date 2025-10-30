/* eslint-disable @typescript-eslint/no-explicit-any */
import { visit } from "unist-util-visit";
import type { Root } from "hast";

export const rehypeHeaderStyle = () => (tree: Root) => {
	visit(tree, "element", (node: any) => {
		if (!node.children) {
			return;
		}
		if (
			node.tagName !== "h1" &&
			node.tagName !== "h2" &&
			node.tagName !== "h3" &&
			node.tagName !== "h4"
		) {
			return;
		}
		node.children?.forEach((child: any) => {
			if (child.type !== "element") {
				return;
			}
			child.properties.parent = node.tagName;
		});
	});
	return tree;
};
