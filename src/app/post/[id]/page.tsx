import { Comments } from "@/components/Comments/Comments";
import Copyright from "@/components/Copyright";
import OutdateTip from "@/components/OutdateTip";
import Toc from "@/components/Toc";
import { config } from "@/data/site-config";
import { initCMS } from "@/libs/content-management";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import * as stylex from "@stylexjs/stylex";
import { MarkdownContent } from "@/components/MarkdownContent";

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

const styles = stylex.create({
	title: {
		fontSize: "1.875rem",
		fontWeight: 700,
		lineHeight: "2.25rem",
		marginBlock: "0.5rem",
		marginInline: "0",
	},
	metadata: {
		marginBlock: "0.5rem",
		marginInline: "0",
		opacity: 0.6,
	},
});

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
			<p {...stylex.props(styles.title)}>{post.title}</p>
			<p {...stylex.props(styles.metadata)}>
				{post.created_at.toLocaleDateString()}
				{post.created_at.valueOf() - post.modified_at.valueOf() == 0
					? ""
					: ` (最后更新于 ${post.modified_at.toLocaleDateString()})`}
			</p>
			<OutdateTip created={post.modified_at.toDateString()} />
			<MarkdownContent>{post.markdown_content.toReactNode()}</MarkdownContent>
			<Copyright title={post.title} id={(await params).id} />
			<Comments />
			<Toc toc={post.markdown_content.toToc().map} />
		</>
	);
}
