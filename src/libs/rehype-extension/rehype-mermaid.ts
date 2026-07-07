import type { Root, Element } from "hast";
import { visitParents } from "unist-util-visit-parents";
import { toText } from "hast-util-to-text";

const mermaidSourceMap = new Map<string, string>();
let mermaidCounter = 0;

export function clearMermaidSources() {
	mermaidSourceMap.clear();
	mermaidCounter = 0;
}

export function getMermaidSources(): { id: string; source: string }[] {
	return Array.from(mermaidSourceMap.entries()).map(([id, source]) => ({
		id,
		source,
	}));
}

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

function extractAndReplace(node: Element): Element {
	const source = toText(node, {
		whitespace: "pre",
	});
	const id = `mermaid-${mermaidCounter++}`;
	mermaidSourceMap.set(id, source);

	return {
		type: "element",
		tagName: "mermaid",
		properties: {
			"data-mermaid-id": id,
		},
		children: [],
	};
}

export const rehypeMermaid = () => (tree: Root) => {
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
				extractAndReplace(node);
			return;
		}
		if (node.tagName === "code") {
			const pre = ancestors.at(-1);
			const parent = ancestors.at(-2);
			if (!parent || !pre || pre.type === "root") {
				return;
			}
			parent.children[parent.children.indexOf(pre)] =
				extractAndReplace(node);
			return;
		}
	});
};
