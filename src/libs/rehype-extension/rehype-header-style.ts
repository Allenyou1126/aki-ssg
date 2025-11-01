import type { Root } from "hast";
import { selectAll } from "hast-util-select";

export const rehypeHeaderStyle = () => (tree: Root) => {
	selectAll("h1 strong", tree).forEach((node) => {
		node.properties.parent = "h1";
	});
	selectAll("h2 strong", tree).forEach((node) => {
		node.properties.parent = "h2";
	});
	selectAll("h3 strong", tree).forEach((node) => {
		node.properties.parent = "h3";
	});
	selectAll("h4 strong", tree).forEach((node) => {
		node.properties.parent = "h4";
	});
	selectAll("hr + *, h2 + *, h3 + *, h4 + *", tree).forEach((node) => {
		node.properties.noTop = true;
	});
	return tree;
};
