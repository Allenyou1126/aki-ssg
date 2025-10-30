import type { Root } from "hast";
import * as stylex from "@stylexjs/stylex";

const style = stylex.create({
	first: {
		marginTop: 0,
	},
	last: {
		marginBottom: 0,
	},
});

export const rehypeTypographyFirstLastChild = () => (tree: Root) => {
	const first = tree.children.at(0);
	const last = tree.children.at(-1);
	if (first && first.type === "element") {
		const firstStyle = stylex.props(style.first);
		first.properties.className = [
			first.properties.className ?? "",
			firstStyle.className,
		].join(" ");
	}
	if (last && last.type === "element") {
		const lastStyle = stylex.props(style.last);
		last.properties.className = [
			last.properties.className ?? "",
			lastStyle.className,
		].join(" ");
	}
	return tree;
};
