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
            parent.children[parent.children.indexOf(node)] = {
                type: "element",
                tagName: "mermaid",
                properties: node.properties,
                children: [
                    {
                        type: "text",
                        value: toText(node, {
                            whitespace: "pre",
                        }),
                    },
                ],
            };
            return;
        }
        if (node.tagName === "code") {
            const pre = ancestors.at(-1);
            const parent = ancestors.at(-2);
            if (!parent || !pre || pre.type === "root") {
                return;
            }
            parent.children[parent.children.indexOf(pre)] = {
                type: "element",
                tagName: "mermaid",
                properties: node.properties,
                children: [
                    {
                        type: "text",
                        value: toText(node, {
                            whitespace: "pre",
                        }),
                    },
                ],
            };
            return;
        }
    });
};
