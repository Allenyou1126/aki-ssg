/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Root } from "mdast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

export const remarkFriendLinks: Plugin<[], Root> =
	() => (tree: Root, file: any) => {
		visit(tree, (node: any) => {
			if (
				node.type === "textDirective" ||
				node.type === "leafDirective" ||
				node.type === "containerDirective"
			) {
				if (node.name !== "friend_links") return;

				const data = node.data || (node.data = {});

				if (node.type === "textDirective")
					file.fail("Text directives for `friend_links` not supported", node);
				if (node.type === "containerDirective")
					file.fail(
						"Container directives for `friend_links` not supported",
						node
					);
				data.hName = "friend-links";
				data.hProperties = {};
			}
		});
	};
