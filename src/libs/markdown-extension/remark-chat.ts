/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Root, Text } from "mdast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";
import { LeafDirective } from "mdast-util-directive";

export const remarkChat: Plugin<[], Root> = () => (tree: Root, file: any) => {
	visit(tree, (node: any) => {
		if (
			node.type !== "textDirective" &&
			node.type !== "leafDirective" &&
			node.type !== "containerDirective"
		) {
			return;
		}
		if (node.name === "chat") {
			const data = node.data || (node.data = {});
			if (node.type === "textDirective")
				file.fail("Text directives for `chat` not supported", node);
			if (node.type === "leafDirective")
				file.fail("Leaf directives for `chat` not supported", node);
			data.hName = "chat";
		} else if (node.name === "chat_item") {
			const data = node.data || (node.data = {});
			const attributes = node.attributes || {};
			if (node.type === "textDirective")
				file.fail("Text directives for `chat_item` not supported", node);
			if (node.type === "containerDirective")
				file.fail("Container directives for `chat_item` not supported", node);
			if (
				(node as LeafDirective).children.length === 0 ||
				(node as LeafDirective).children[0].type !== "text"
			) {
				file.fail("Missing chat content", node)(data as any).hName =
					"div" as string;
			}
			const name = attributes.name;
			const avatar = attributes.avatar;
			const self = attributes.self !== undefined;
			data.hName = "chat-item";
			data.hProperties = {
				sender_name: name,
				sender_avatar: avatar,
				align_right: self,
			};
			data.hChildren = [(node as LeafDirective).children[0] as Text];
		} else if (node.name === "chat_sender") {
			const data = node.data || (node.data = {});
			const attributes = node.attributes || {};
			if (node.type === "textDirective")
				file.fail("Text directives for `chat_sender` not supported", node);
			if (node.type === "containerDirective")
				file.fail("Container directives for `chat_sender` not supported", node);
			const name = attributes.name;
			if (!name)
				file.fail("Missing sender name", node)(data as any).hName =
					"div" as string;
			const avatar = attributes.avatar;
			const self = attributes.self !== undefined;
			data.hName = "chat-sender";
			data.hProperties = {
				sender_name: name,
				sender_avatar: avatar,
				align_right: self,
			};
		} else {
			return;
		}
	});
};
