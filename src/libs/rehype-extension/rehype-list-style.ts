/* eslint-disable @typescript-eslint/no-explicit-any */
import { visit } from "unist-util-visit";
import type { Root } from "hast";
import * as stylex from "@stylexjs/stylex";

const style = stylex.create({
	subList: {
		marginBottom: "0.75em",
		marginTop: "0.75em",
	},
	firstLiParagraph: {
		marginTop: "1.25em",
	},
	lastLiParagraph: {
		marginBottom: "1.25em",
	},
	midLiParagraph: {
		marginBottom: "0.75em",
		marginTop: "0.75em",
	},
});

export const rehypeListStyle = () => (tree: Root) => {
	visit(tree, "element", (node: any) => {
		if (node.tagName !== "ul" && node.tagName !== "ol") {
			return;
		}
		node.children?.forEach((child: any) => {
			if (child.type !== "element") {
				return;
			}
			if (child.tagName === "ul" || child.tagName === "ol") {
				const lastStyle = stylex.props(style.subList);
				child.properties.className = [
					child.properties.className,
					lastStyle.className,
				].join(" ");
				return;
			}
			if (child.tagName === "li") {
				if (!child.children) {
					return;
				}
				const len = child.children.length;
				const midStyle = stylex.props(style.midLiParagraph);
				for (let i = 1; i < len - 1; i++) {
					child.children[i].properties.className = [
						child.children[i].properties.className,
						midStyle.className,
					].join(" ");
				}
				const first = child.children.at(0);
				const last = child.children.at(-1);
				if (first && first.type === "element") {
					const firstStyle = stylex.props(style.firstLiParagraph);
					first.properties.className = [
						first.properties.className,
						firstStyle.className,
					].join(" ");
				}
				if (last && last.type === "element") {
					const lastStyle = stylex.props(style.lastLiParagraph);
					last.properties.className = [
						last.properties.className,
						lastStyle.className,
					].join(" ");
				}
				return;
			}
		});
	});
	return tree;
};
