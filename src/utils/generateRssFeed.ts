import { config } from "@/data/site-config";
import { initCMS } from "@/libs/content-management";
import RSS from "rss";
import fs from "fs";
import path from "path";

export function generateRssFeed() {
	const feed = new RSS({
		title: config.blog.title,
		description: config.blog.description,
		site_url: `https://${config.blog.hostname}/`,
		feed_url: `https://${config.blog.hostname}/feed/`,
		language: "zh-CN",
		custom_elements:
			config.follow === undefined
				? undefined
				: [
						{
							follow_challenge: [
								{ feedId: config.follow.feed_id },
								{ userId: config.follow.user_id },
							],
						},
				  ],
		generator: "Aki-SSG",
	});
	initCMS().then((cms) => {
		cms.getPostId().forEach((id) => {
			const post = cms.getPost(id)!;
			feed.item({
				title: post.title,
				description: post.description,
				url: `https://${config.blog.hostname}/post/${id}`,
				date: post.modified_at,
			});
		});
		fs.promises.writeFile(
			path.join(process.cwd(), "public", "feed.xml"),
			feed.xml(),
			{
				flag: "w",
			}
		);
	});
}
