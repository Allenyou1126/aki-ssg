/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Root } from "mdast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

export const remarkNeteaseMusic: Plugin<[], Root> =
	() => (tree: Root, file: any) => {
		visit(tree, (node: any) => {
			if (
				node.type === "textDirective" ||
				node.type === "leafDirective" ||
				node.type === "containerDirective"
			) {
				if (node.name !== "netease_music") return;

				const data = node.data || (node.data = {});
				const attributes = node.attributes || {};
				const id = attributes.id;

				if (node.type === "textDirective")
					file.fail("Text directives for `netease_music` not supported", node);
				if (node.type === "containerDirective")
					file.fail(
						"Container directives for `netease_music` not supported",
						node
					);
				if (!id)
					file.fail("Missing music id", node)(data as any).hName =
						"div" as string;
				data.hName = "netease-music";
				data.hProperties = {
					id,
				};
			}
		});
	};
