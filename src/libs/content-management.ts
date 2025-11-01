import { friend_link_list } from "@/data/friend-link";
import { promises as fs } from "fs";
import fm from "front-matter";
import path from "path";
import { cache } from "react";
import { MarkdownContent } from "@/libs/markdown-server";
import { isProd } from "@/libs/state-management";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MetadataParser<MetadataType> = (attr: any) => MetadataType;

function defineMetadataParser<MetadataType>(
	parser: (attr: unknown) => MetadataType
) {
	return (attr: unknown) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return parser(attr as any);
	};
}

const post_metadata_parser = defineMetadataParser<PostMetadata>(
	(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		attr: any
	) => {
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
			description: attr.description ?? "暂无描述",
			created_at: new Date(
				attr.created_at ?? attr.modified_at ?? "1919-08-10T11:45:14Z"
			),
			modified_at: new Date(
				attr.modified_at ?? attr.created_at ?? "1919-08-10T11:45:14Z"
			),
			draft:
				attr.draft === undefined || typeof attr.draft !== "boolean"
					? false
					: attr.draft,
		};
	}
);
const page_metadata_parser = defineMetadataParser<PageMetadata>(
	(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		attr: any
	) => {
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
			enable_comment:
				attr.enable_comment === undefined ||
				typeof attr.enable_comment !== "boolean"
					? false
					: attr.enable_comment,
			allow_index:
				attr.allow_index === undefined || typeof attr.allow_index !== "boolean"
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
			draft:
				attr.draft === undefined || typeof attr.draft !== "boolean"
					? false
					: attr.draft,
		};
	}
);

class CMS {
	private friend_links: FriendLink[] = [];
	private posts: Post[] = [];
	private pages: Page[] = [];

	private async parseMarkdownFile<MetadataType>(
		path: string,
		metadata_parser: MetadataParser<MetadataType>
	): Promise<MetadataType & Content> {
		return await fs
			.readFile(path)
			.then((file) => {
				return fm(file.toString());
			})
			.then((data) => {
				const metadata = metadata_parser(data.attributes);
				return {
					...metadata,
					original_content: data.body,
					markdown_content: new MarkdownContent(data.body),
				};
			});
	}
	private async processAllFile<T>(
		files: string[],
		metadata_parser: MetadataParser<T>
	) {
		return Promise.all(
			files
				.filter((filename) => filename.endsWith(".md"))
				.map((filename) => this.parseMarkdownFile(filename, metadata_parser))
		);
	}
	private async loadPosts() {
		const posts_path = path.join(process.cwd(), "src", "data", "posts");
		await fs
			.readdir(posts_path)
			.then((files) => files.map((file) => path.join(posts_path, file)))
			.then((paths) => this.processAllFile(paths, post_metadata_parser))
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
		await fs
			.readdir(pages_path)
			.then((files) => files.map((file) => path.join(pages_path, file)))
			.then((paths) => this.processAllFile(paths, page_metadata_parser))
			.then((list) => {
				this.pages = list.filter((v) => !isProd || !v.draft);
			});
	}
	async init() {
		this.friend_links = friend_link_list;
		await Promise.all([this.loadPosts(), this.loadPages()]);
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
