import { friend_link_list } from "@/data/friend-link";
import { promises as fs } from "fs";
import fm from "front-matter";
import path from "path";
import React from "react";
import { MarkdownContent } from "./markdown-render";

class CMS {
	private friend_links: FriendLink[] = [];
	private posts: Post[] = [];
	private pages: Page[] = [];
	async init() {
		this.friend_links = friend_link_list;
		await Promise.all([
			fs
				.readdir(path.join(process.cwd(), "src", "data", "posts"))
				.then((files) => {
					return Promise.all(
						files.map(async (filename) => {
							if (!filename.endsWith(".md")) {
								return undefined;
							}
							return await fs
								.readFile(
									path.join(process.cwd(), "src", "data", "posts", filename)
								)
								.then((file) => {
									return fm(file.toString());
								})
								.then((data) => {
									// eslint-disable-next-line @typescript-eslint/no-explicit-any
									const attr = data.attributes as any;
									const id_str = attr.id;
									if (id_str === undefined) {
										throw new Error(`Please specify an ID for post!`);
									}
									const id = parseInt(id_str);
									if (isNaN(id)) {
										throw new Error(`Invalid post ID ${id_str}`);
									}
									const title = attr.title;
									if (title === undefined) {
										throw new Error(`Please specify a title for post!`);
									}
									return {
										id,
										title,
										original_content: data.body,
										markdown_content: new MarkdownContent(data.body),
										description:
											attr.description === undefined
												? "暂无描述"
												: attr.description,
										modified_at: new Date(
											attr.modified_at === undefined
												? "1919-08-10T11:45:14Z"
												: attr.modified_at
										),
									};
								});
						})
					);
				})
				.then((list) => {
					this.posts = list.filter((v) => v !== undefined);
				}),
			fs
				.readdir(path.join(process.cwd(), "src", "data", "pages"))
				.then((files) => {
					return Promise.all(
						files.map(async (filename) => {
							if (!filename.endsWith(".md")) {
								return undefined;
							}
							return await fs
								.readFile(
									path.join(process.cwd(), "src", "data", "pages", filename)
								)
								.then((file) => {
									return fm(file.toString());
								})
								.then((data) => {
									// eslint-disable-next-line @typescript-eslint/no-explicit-any
									const attr = data.attributes as any;
									const slug = attr.slug;
									if (slug === undefined) {
										throw new Error(`Please specify a slug for page!`);
									}
									const title = attr.title;
									if (title === undefined) {
										throw new Error(`Please specify a title for page!`);
									}
									return {
										slug,
										title,
										original_content: data.body,
										markdown_content: new MarkdownContent(data.body),
										enable_comment:
											attr.enable_comment === undefined ||
											typeof attr.enable_comment !== "boolean"
												? false
												: attr.enable_comment,
										allow_index:
											attr.allow_index === undefined ||
											typeof attr.allow_index !== "boolean"
												? false
												: attr.allow_index,
										navigation_title: attr.navigation_title,
										navigation_index:
											attr.navigation_index === undefined
												? 0
												: ((v) => {
														const id = parseInt(v);
														if (isNaN(id)) {
															throw new Error();
														}
														return id;
												  })(attr.navigation_index),
									};
								});
						})
					);
				})
				.then((list) => {
					this.pages = list.filter((v) => v !== undefined);
				}),
		]);
	}
	getFriendLinks() {
		return this.friend_links;
	}
	getPost(id: number) {
		return this.posts.find((val) => {
			return val.id === id;
		});
	}
	getPage(slug: string) {
		return this.pages.find((val) => {
			return val.slug === slug;
		});
	}
	getPostId() {
		return this.posts.map((p) => p.id);
	}
	getPageSlug() {
		return this.pages.map((p) => p.slug);
	}
	getPosts() {
		return this.posts;
	}
	getPages() {
		return this.pages;
	}
	getPostsByPage(page: number) {
		const begin = (page - 1) * 10;
		const end = Math.min(page * 10, this.posts.length);
		return this.posts.slice(begin, end);
	}
}

export const initCMS = React.cache(async () => {
	const ret = new CMS();
	await ret.init();
	return ret;
});
