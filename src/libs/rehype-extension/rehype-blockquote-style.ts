import { selectAll } from "hast-util-select";
import type { Root } from "hast";

export const rehypeBlockquoteStyle = () => (tree: Root) => {
	selectAll("blockquote p:first-of-type", tree).forEach((node) => {
		node.properties.parent = "blockquote";
		node.properties.first = true;
	});
	selectAll("blockquote p:last-of-type", tree).forEach((node) => {
		node.properties.parent = "blockquote";
		node.properties.last = true;
	});
	return tree;
};
