/* eslint-disable @typescript-eslint/no-explicit-any */
import { visit } from "unist-util-visit";
import type { Root } from "hast";

export const rehypeRemoveBreakline = () => (tree: Root) => {
	visit(tree, "root", (node: any) => {
		node.children = node.children?.filter(
			(child: any) => child.type !== "text" || child.value !== "\n"
		);
	});
	return tree;
};
