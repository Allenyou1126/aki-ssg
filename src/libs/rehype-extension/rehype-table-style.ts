import type { Root } from "hast";
import { selectAll } from "hast-util-select";

export const rehypeTableStyle = () => (tree: Root) => {
	selectAll("tbody tr", tree).forEach((node) => {
		node.properties.parent = "tbody";
	});
	selectAll("tfoot tr", tree).forEach((node) => {
		node.properties.parent = "tfoot";
	});
	selectAll("thead th:first-child, tbody td:first-child", tree).forEach(
		(node) => {
			node.properties.first = true;
		}
	);
	selectAll("thead th:last-child, tbody td:last-child", tree).forEach(
		(node) => {
			node.properties.last = true;
		}
	);
	return tree;
};
