import type { Root } from "hast";
import { selectAll } from "hast-util-select";

export const rehypeCodeStyle = () => (tree: Root) => {
	selectAll("pre code", tree).forEach((node) => {
		node.properties.parent = "pre";
	});
	return tree;
};
