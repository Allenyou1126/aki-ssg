import { Comments } from "@/components/Comments/Comments";
import { config } from "@/data/site-config";
import { initCMS } from "@/libs/content-management";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "@/styles/code-highlight.css";
import "@/styles/content.css";

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
			<p className="content-title">{page.title}</p>
			<div className="content">{page.markdown_content.toReactNode()}</div>
			{page.enable_comment && <Comments />}
		</>
	);
}
