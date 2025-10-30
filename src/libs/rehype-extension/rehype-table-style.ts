/* eslint-disable @typescript-eslint/no-explicit-any */
import { visit } from "unist-util-visit";
import type { Root } from "hast";

export const rehypeTableStyle = () => (tree: Root) => {
	visit(tree, "element", (node: any) => {
		if (!node.children) {
			return;
		}
		if (node.tagName === "tbd") {
			node.tagName = "tbody";
		}
		if (
			node.tagName !== "thead" &&
			node.tagName !== "tbody" &&
			node.tagName !== "tfoot" &&
			node.tagName !== "tbd"
		) {
			return;
		}
		node.children?.forEach((child: any) => {
			if (child.type !== "element") {
				return;
			}
			child.properties.parent = node.tagName;
		});
		const first = node.children.at(0);
		const last = node.children.at(-1);
		if (first && first.type === "element") {
			first.properties.first = true;
		}
		if (last && last.type === "element") {
			last.properties.last = true;
		}
	});
	return tree;
};
