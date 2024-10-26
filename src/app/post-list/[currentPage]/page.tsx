import { config } from "@/data/site-config";
import { initCMS } from "@/libs/content-management";
import { connectString } from "@/utils/connectString";
import { Metadata } from "next";
import Link from "next/link";

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
		return (
			<div key={index} className="mb-8">
				<Link
					className="text-primary font-bold text-2xl my-4 hover:text-primary/80"
					href={`/post/${post.id}`}>
					{post.title}
				</Link>
				<p className="opacity-60 my-4 darkani">
					{post.modified_at.toLocaleDateString()}
				</p>
				<p className="my-4 darkani">{post.description}</p>
			</div>
		);
	});
	return (
		<div className="rounded-3xl bg-white/70 dark:bg-gray-950/70 backdrop-blur-lg backdrop-filter w-full max-w-4xl md:w-4xl p-6 min-h-48 transition-colors duration-500">
			{postList}
			<div
				className={connectString([
					total_page <= 1 ? "hidden" : "",
					"relative h-12 mt-8",
				])}>
				<p className="absolute top-2/4 -translate-y-2/4 left-0 right-0 m-auto text-center text-base">{`第${current_page}页，共${total_page}页`}</p>
				<Link
					className={connectString([
						current_page <= 1 ? "hidden" : "",
						"absolute left-0 px-4 py-2 rounded-3xl bg-primary text-base top-2/4 -translate-y-2/4 font-bold text-white hover:opacity-90",
					])}
					href={`/post-list/${current_page - 1}`}>
					上一页
				</Link>
				<Link
					className={connectString([
						current_page >= total_page ? "hidden" : "",
						"absolute right-0 px-4 py-2 rounded-3xl bg-primary text-base top-2/4 -translate-y-2/4 font-bold text-white hover:opacity-90",
					])}
					href={`/post-list/${current_page + 1}`}>
					下一页
				</Link>
			</div>
		</div>
	);
}
