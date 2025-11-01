import { Comments } from "@/components/Comments/Comments";
import { config } from "@/data/site-config";
import { initCMS } from "@/libs/content-management";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import * as stylex from "@stylexjs/stylex";
import { MarkdownContent } from "@/components/MarkdownContent";

export async function generateStaticParams() {
	const cms = await initCMS();
	return cms.getPageSlug().map((s) => {
		return {
			slug: s,
		};
	});
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const cms = await initCMS();
	const page = cms.getPage((await params).slug);
	if (page === undefined) {
		notFound();
	}
	return {
		title: `${page.title} - ${config.blog.title}`,
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
});

export default async function CustomPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const cms = await initCMS();
	const page = cms.getPage((await params).slug);
	if (page === undefined) {
		notFound();
	}
	return (
		<>
			<p {...stylex.props(styles.title)}>{page.title}</p>
			<MarkdownContent>{page.markdown_content.toReactNode()}</MarkdownContent>
			{page.enable_comment && <Comments />}
		</>
	);
}
