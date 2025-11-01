import type { Root } from "hast";
import { selectAll } from "hast-util-select";

export const rehypeListStyle = () => (tree: Root) => {
	selectAll("ul ol, ul ul, ol ul, ol ol", tree).forEach((node) => {
		node.properties.parent = "list";
	});
	selectAll("ul > li > p, ol > li > p", tree).forEach((node) => {
		node.properties.parent = "listItem";
	});
	selectAll("ul > li > p:first-child, ol > li > p:first-child", tree).forEach(
		(node) => {
			node.properties.first = true;
		}
	);
	selectAll("ul > li > p:last-child, ol > li > p:last-child", tree).forEach(
		(node) => {
			node.properties.last = true;
		}
	);
	return tree;
};
