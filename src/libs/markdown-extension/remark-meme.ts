/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Root } from "mdast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

export const remarkMeme: Plugin<[], Root> = () => (tree: Root, file: any) => {
	visit(tree, (node: any) => {
		if (
			node.type === "textDirective" ||
			node.type === "leafDirective" ||
			node.type === "containerDirective"
		) {
			if (node.name !== "meme") return;

			const data = node.data || (node.data = {});
			const attributes = node.attributes || {};
			const group = attributes.group;
			const mid = attributes.mid;

			if (node.type === "leafDirective")
				file.fail("Leaf directives for `meme` not supported", node);
			if (node.type === "containerDirective")
				file.fail("Container directives for `meme` not supported", node);
			if (!group)
				file.fail("Missing Meme group.", node)(data as any).hName =
					"div" as string;
			if (!mid)
				file.fail("Missing Meme mid.", node)(data as any).hName =
					"div" as string;
			data.hName = "meme";
			data.hProperties = {
				group,
				mid,
			};
		}
	});
};
