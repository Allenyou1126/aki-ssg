/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Root } from "mdast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

export const remarkBilibili: Plugin<[], Root> =
	() => (tree: Root, file: any) => {
		visit(tree, (node: any) => {
			if (
				node.type === "textDirective" ||
				node.type === "leafDirective" ||
				node.type === "containerDirective"
			) {
				if (node.name !== "bilibili") return;

				const data = node.data || (node.data = {});
				const attributes = node.attributes || {};
				const bvid = attributes.bvid;
				const cid = attributes.cid;

				if (node.type === "textDirective")
					file.fail("Text directives for `bilibili` not supported", node);
				if (node.type === "containerDirective")
					file.fail("Container directives for `bilibili` not supported", node);
				if (!bvid)
					file.fail("Missing video bvid", node)(data as any).hName =
						"div" as string;
				data.hName = "bilibili";
				data.hProperties = {
					bvid,
					cid,
				};
			}
		});
	};
