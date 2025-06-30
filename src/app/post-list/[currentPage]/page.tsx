import { config } from "@/data/site-config";
import { initCMS } from "@/libs/content-management";
import type { Metadata } from "next";
import Link from "next/link";
import pageSwitcher from "@/styles/utils/page-switcher.module.css";
import postlist from "./style.module.css";

export async function generateStaticParams() {
	const cms = await initCMS();
	const total: number = Math.ceil(cms.getPostId().length / 10);
	const ret = [];
	for (let i: number = 1; i <= total; ++i) {
		ret.push({
			currentPage: i.toString(),
		});
	}
	return ret;
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{
		currentPage: number;
	}>;
}): Promise<Metadata> {
	return {
		title: `文章列表 - 第${(await params).currentPage}页 - ${
			config.blog.title
		}`,
	};
}

function PostListItem({ post }: { post: Post }) {
	return (
		<div className={postlist.item}>
			<Link className={postlist.link} href={`/post/${post.id}`}>
				{post.title}
			</Link>
			<p className={postlist.metadata}>
				{post.created_at.toLocaleDateString()}
				{post.created_at.valueOf() - post.modified_at.valueOf() == 0
					? ""
					: ` (最后更新于 ${post.modified_at.toLocaleDateString()})`}
			</p>
			<p className={postlist.description}>{post.description}</p>
		</div>
	);
}

export default async function PostListPage({
	params,
}: {
	params: Promise<{
		currentPage: number;
	}>;
}) {
	const cms = await initCMS();
	const total_page = Math.ceil(cms.getPostId().length / 10);
	const current_page = (await params).currentPage;
	const posts = cms.getPostsByPage(current_page);
	const postList = posts.map((post, index) => {
		return <PostListItem post={post} key={index} />;
	});
	return (
		<>
			{postList}
			<div
				style={{
					display: total_page <= 1 ? "none" : undefined,
				}}
				className={pageSwitcher.wrap}>
				<p className={pageSwitcher.page}>
					第{current_page}页，共{total_page}页
				</p>
				<Link
					style={{
						left: 0,
						display: current_page <= 1 ? "none" : undefined,
					}}
					className={pageSwitcher.button}
					href={`/post-list/${parseInt(current_page.toString()) - 1}`}>
					上一页
				</Link>
				<Link
					style={{
						right: 0,
						display: current_page >= total_page ? "none" : undefined,
					}}
					className={pageSwitcher.button}
					href={`/post-list/${parseInt(current_page.toString()) + 1}`}>
					下一页
				</Link>
			</div>
		</>
	);
}
