import type { Root, Element } from "hast";
import { visitParents } from "unist-util-visit-parents";
import { toText } from "hast-util-to-text";

function isMermaidElement(element: Element): boolean {
	let mermaidClassName: string;

	if (element.tagName === "pre") {
		mermaidClassName = "mermaid";
	} else if (element.tagName === "code") {
		mermaidClassName = "language-mermaid";
	} else {
		return false;
	}

	let className = element.properties?.className;
	if (className === undefined) {
		return false;
	}
	if (typeof className === "string") {
		className = className.split(" ");
	}

	if (!Array.isArray(className)) {
		return false;
	}

	return className.includes(mermaidClassName);
}

function extractAndReplace(node: Element, counter: number): Element {
	const source = toText(node, { whitespace: "pre" });
	const id = `mermaid-${counter}`;

	return {
		type: "element",
		tagName: "mermaid",
		properties: {
			"data-mermaid-id": id,
		},
		children: [
			{
				type: "text",
				value: source,
			},
		],
	};
}

export const rehypeMermaid = () => (tree: Root) => {
	let counter = 0;
	visitParents(tree, "element", (node, ancestors) => {
		if (!isMermaidElement(node)) {
			return;
		}
		if (node.tagName === "pre") {
			const parent = ancestors.at(-1);
			if (!parent) {
				return;
			}
			parent.children[parent.children.indexOf(node)] =
				extractAndReplace(node, counter++);
			return;
		}
		if (node.tagName === "code") {
			const pre = ancestors.at(-1);
			const parent = ancestors.at(-2);
			if (!parent || !pre || pre.type === "root") {
				return;
			}
			parent.children[parent.children.indexOf(pre)] =
				extractAndReplace(node, counter++);
			return;
		}
	});
};
