/* eslint-disable @typescript-eslint/no-explicit-any */
import { visit } from "unist-util-visit";
import type { Root } from "hast";

export const rehypeListStyle = () => (tree: Root) => {
	visit(tree, "element", (node: any) => {
		if (node.tagName !== "ul" && node.tagName !== "ol") {
			return;
		}
		if (!node.children) {
			return;
		}
		const len = node.children.length;
		for (let i = 0; i < len; i++) {}
		node.children?.forEach((child: any) => {
			if (child.type !== "element") {
				return;
			}
			child.properties.parent = "list";
			if (child.tagName !== "li") {
				return;
			}
			if (!child.children) {
				return;
			}
			child.children.forEach((p: any) => {
				if (p.type !== "element") {
					return;
				}
				p.properties.parent = "listItem";
			});
			const first = child.children.at(0);
			const last = child.children.at(-1);
			if (first && first.type === "element") {
				first.properties.first = true;
			}
			if (last && last.type === "element") {
				last.properties.last = true;
			}
		});
	});
	return tree;
};
