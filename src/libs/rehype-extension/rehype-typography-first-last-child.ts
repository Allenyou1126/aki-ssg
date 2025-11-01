import type { Root } from "hast";

export const rehypeTypographyFirstLastChild = () => (tree: Root) => {
	const first = tree.children.at(0);
	const last = tree.children.at(-1);
	if (first && first.type === "element") {
		first.properties.noTop = true;
	}
	if (last && last.type === "element") {
		last.properties.noBottom = true;
	}
	return tree;
};
