// import { Comments } from "@/components/Comments";
import { Comments } from "@/components/Comments";
import Copyright from "@/components/Copyright";
import OutdateTip from "@/components/OutdateTip";
import Toc from "@/components/Toc";
import { config } from "@/data/site-config";
import { initCMS } from "@/libs/content-management";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "@/styles/code-highlight.css";

export async function generateStaticParams() {
	const cms = await initCMS();
	return cms.getPostId().map((i) => {
		return {
			id: i.toString(),
		};
	});
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{
		id: number;
	}>;
}): Promise<Metadata> {
	const cms = await initCMS();
	const post = cms.getPost(parseInt((await params).id.toString()));
	if (post === undefined) {
		notFound();
	}
	return {
		title: `${post.title} - ${config.blog.title}`,
		description: post.description,
	};
}

export default async function PostPage({
	params,
}: {
	params: Promise<{
		id: number;
	}>;
}) {
	const cms = await initCMS();
	const post = cms.getPost(parseInt((await params).id.toString()));
	if (post === undefined) {
		notFound();
	}
	return (
		<>
			<p className="text-3xl font-bold my-2 darkani">{post.title}</p>
			<p className="opacity-60 my-2 darkani">
				{post.created_at.toLocaleDateString()}
				{post.created_at.valueOf() - post.modified_at.valueOf() == 0
					? ""
					: ` (最后更新于 ${post.modified_at.toLocaleDateString()})`}
			</p>
			<OutdateTip created={post.modified_at.toDateString()} />
			<div className="ay-prose max-w-4xl my-8">
				{post.markdown_content.toReactNode()}
			</div>
			<Copyright title={post.title} id={(await params).id} />
			<Comments />
			<Toc toc={post.markdown_content.toToc().map} />
		</>
	);
}
