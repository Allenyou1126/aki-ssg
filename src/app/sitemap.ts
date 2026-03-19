export const dynamic = "force-static";
export const revalidate = false;

import { config } from "@/data/site-config";
import { initCMS } from "@/libs/content-management";
import { generateRssFeed } from "@/utils/generateRssFeed";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const cms = await initCMS();
	const postLinks = cms.getPostId().map((id) => {
		const post = cms.getPost(id)!;
		return {
			url: `https://${config.blog.hostname}/post/${id}`,
			lastModified: post.modified_at,
		};
	});
	const pageLinks = cms
		.getPages()
		.filter((p) => p.allow_index)
		.map((p) => {
			return {
				url: `https://${config.blog.hostname}/${p.slug}`,
				lastModified: new Date(),
			};
		});
	// 由于Next没有提供合适的Hook，所以在这里生成RSS
	await generateRssFeed();
	return [
		{
			url: `https://${config.blog.hostname}/`,
			lastModified: new Date(),
		},
	]
		.concat(postLinks)
		.concat(pageLinks);
}
