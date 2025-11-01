import type { Root } from "hast";
import * as stylex from "@stylexjs/stylex";
import { selectAll } from "hast-util-select";

const style = stylex.create({
	math: {
		display: "inline",
		verticalAlign: "middle",
	},
});

export const rehypeMathjaxPlus = () => (tree: Root) => {
	selectAll("mjx-container > svg", tree).forEach((node) => {
		node.properties.className = stylex.props(style.math).className;
	});
	return tree;
};
