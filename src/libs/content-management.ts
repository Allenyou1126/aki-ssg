import { friend_link_list } from "@/data/friend-link";
import fs from "fs";
import path from "path";
import { cache } from "react";
import {
	deserializeMarkdownContent,
	renderMarkdownContent,
} from "@/libs/markdown-render";
import { isProd } from "@/libs/state-management";
import * as z from "zod";
import * as zc from "zod/v4/core";
import { config } from "@/data/site-config";
import { tryObtainLock, waitingForLockRelease } from "@/utils/fileLock";

const MASTER_LOCK_FILE = path.join(process.cwd(), ".master.cms.lock");
const LOADING_LOCK_FILE = path.join(process.cwd(), ".loading.cms.lock");

const FRIEND_LINK_FILE = path.join(process.cwd(), ".friend-link.cms.json");
const POST_DATA_FILE = path.join(process.cwd(), ".post-data.cms.json");
const PAGE_DATA_FILE = path.join(process.cwd(), ".page-data.cms.json");

const date = z.union([
	z.date("Date must be a date string or date object"),
	z
		.string("Date must be a date string or date object")
		.refine((val) => !isNaN(Date.parse(val)), {
			message: "Invalid date string",
		})
		.transform((val) => new Date(val)),
]);

const PostMetadataSchema = z
	.object({
		id: z
			.number("id must be a number")
			.int("id must be an integer")
			.nonnegative("id cannot be negative"),
		title: z.string("Require title").min(1, "Title cannot be empty"),
		description: z
			.string("Description must be a string")
			.optional()
			.default("暂无描述"),
		created_at: date.optional(),
		modified_at: date.optional(),
		draft: z.boolean("draft must be a boolean").optional().default(false),
	})
	.refine((data) => {
		if (data.modified_at !== undefined && data.created_at !== undefined) {
			return data.modified_at >= data.created_at;
		}
		return true;
	}, "modified_at must be greater than or equal to created_at")
	.refine((data) => {
		return data.created_at !== undefined || data.modified_at !== undefined;
	}, "Either created_at or modified_at must be provided");

const PageMetadataSchema = z.object({
	slug: z.string("Require slug").min(1, "Slug cannot be empty"),
	title: z.string("Require title").min(1, "Title cannot be empty"),
	enable_comment: z
		.boolean("enable_comment must be a boolean")
		.optional()
		.default(false),
	allow_index: z
		.boolean("allow_index must be a boolean")
		.optional()
		.default(false),
	navigation_title: z
		.string("Navigation title must be a string")
		.min(1, "Navigation title cannot be empty")
		.optional(),
	navigation_index: z
		.number("Navigation index must be a number")
		.int("Navigation index must be an integer")
		.nonnegative("Navigation index cannot be negative")
		.optional()
		.default(0),
	draft: z.boolean("draft must be a boolean").optional().default(false),
});

class CMS {
	private friend_links: FriendLink[] = [];
	private posts: Post[] = [];
	private pages: Page[] = [];

	private async parseMarkdownFile<T extends zc.$ZodObject>(
		path: string,
		metadataSchema: T,
	): Promise<zc.output<T> & Content> {
		return await fs.promises
			.readFile(path, {
				encoding: "utf-8",
				flag: "r",
			})
			.then((data) => {
				return renderMarkdownContent(data, metadataSchema);
			});
	}
	private async processAllFile<T extends zc.$ZodObject>(
		files: string[],
		metadataSchema: T,
	) {
		return Promise.all(
			files
				.filter((filename) => filename.endsWith(".md"))
				.map((filename) => this.parseMarkdownFile(filename, metadataSchema)),
		);
	}
	private async loadPosts() {
		const posts_path = path.join(process.cwd(), "src", "data", "posts");
		await fs.promises
			.readdir(posts_path)
			.then((files) => files.map((file) => path.join(posts_path, file)))
			.then((paths) => this.processAllFile(paths, PostMetadataSchema))
			.then((posts) =>
				posts.map((post) => {
					if (!post.created_at && post.modified_at) {
						post.created_at = post.modified_at;
					}
					if (!post.modified_at && post.created_at) {
						post.modified_at = post.created_at;
					}
					return post as Omit<
						z.infer<typeof PostMetadataSchema>,
						"created_at" | "modified_at"
					> &
						Content & {
							created_at: Date;
							modified_at: Date;
						};
				}),
			)
			.then((list) => {
				this.posts = list
					.filter((v) => !isProd || !v.draft)
					.sort((a, b) => {
						return b.id - a.id;
					});
			});
	}
	private async loadPages() {
		const pages_path = path.join(process.cwd(), "src", "data", "pages");
		await fs.promises
			.readdir(pages_path)
			.then((files) => files.map((file) => path.join(pages_path, file)))
			.then((paths) => this.processAllFile(paths, PageMetadataSchema))
			.then((list) => {
				this.pages = list.filter((v) => !isProd || !v.draft);
			});
	}
	async init() {
		// Try to get master Lock
		const masterLock = await tryObtainLock(MASTER_LOCK_FILE);
		if (masterLock === null) {
			await this.initSlave();
			return;
		}
		const loadingLock = await tryObtainLock(LOADING_LOCK_FILE);
		if (loadingLock === null) {
			return;
		}
		// Load data
		this.friend_links = friend_link_list;
		if (config.enhanced_markdown.shuffle_friend_links) {
			this.friend_links = this.friend_links
				.map((value) => ({
					value,
					index: Math.floor(Math.random() * 1000000) % this.friend_links.length,
				}))
				.sort((a, b) => a.index - b.index)
				.map((v) => v.value);
		}
		await Promise.all([this.loadPosts(), this.loadPages()]);
		// Save to FS-based database
		const friendLinkSavePromise = fs.promises.writeFile(
			FRIEND_LINK_FILE,
			JSON.stringify(this.friend_links),
			{
				encoding: "utf-8",
				flag: "w",
			},
		);
		const postSavePromise = fs.promises.writeFile(
			POST_DATA_FILE,
			JSON.stringify(
				this.posts.map(({ markdown_content, ...rest }) => {
					return {
						...rest,
						markdown_content: markdown_content.serialize(),
					};
				}),
			),
			{
				encoding: "utf-8",
				flag: "w",
			},
		);
		const pageSavePromise = fs.promises.writeFile(
			PAGE_DATA_FILE,
			JSON.stringify(
				this.pages.map(({ markdown_content, ...rest }) => {
					return {
						...rest,
						markdown_content: markdown_content.serialize(),
					};
				}),
			),
			{
				encoding: "utf-8",
				flag: "w",
			},
		);
		await Promise.all([
			friendLinkSavePromise,
			postSavePromise,
			pageSavePromise,
		]);
		// Release loading lock
		await loadingLock();
	}
	async initSlave() {
		// Wait for loading lock release
		await waitingForLockRelease(LOADING_LOCK_FILE);
		// Load data from FS-based database
		const friendLinkLoadPromise = fs.promises
			.readFile(FRIEND_LINK_FILE, {
				encoding: "utf-8",
				flag: "r",
			})
			.then((data) => JSON.parse(data))
			.then((data) => {
				this.friend_links = data;
			});
		const postLoadPromise = fs.promises
			.readFile(POST_DATA_FILE, {
				encoding: "utf-8",
				flag: "r",
			})
			.then((data) => JSON.parse(data))
			.then((data) => {
				this.posts = data.map(
					(
						post: Omit<
							Post,
							"markdown_content" | "created_at" | "modified_at"
						> & {
							markdown_content: string;
							created_at: string;
							modified_at: string;
						},
					) => ({
						...post,
						created_at: new Date(post.created_at),
						modified_at: new Date(post.modified_at),
						markdown_content: deserializeMarkdownContent(post.markdown_content),
					}),
				);
			});
		const pageLoadPromise = fs.promises
			.readFile(PAGE_DATA_FILE, {
				encoding: "utf-8",
				flag: "r",
			})
			.then((data) => JSON.parse(data))
			.then((data) => {
				this.pages = data.map(
					(
						page: Omit<
							Page,
							"markdown_content" | "created_at" | "modified_at"
						> & {
							markdown_content: string;
							created_at: string;
							modified_at: string;
						},
					) => ({
						...page,
						created_at: new Date(page.created_at),
						modified_at: new Date(page.modified_at),
						markdown_content: deserializeMarkdownContent(page.markdown_content),
					}),
				);
			});
		await Promise.all([
			friendLinkLoadPromise,
			postLoadPromise,
			pageLoadPromise,
		]);
	}
	getFriendLinks() {
		return this.friend_links;
	}
	getPost(id: number) {
		return this.posts.find((val) => val.id === id);
	}
	getPage(slug: string) {
		return this.pages.find((val) => val.slug === slug);
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

export const initCMS = cache(async () => {
	const ret = new CMS();
	await ret.init();
	return ret;
});
