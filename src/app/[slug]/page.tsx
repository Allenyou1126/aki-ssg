import { Comments } from "@/components/Comments";
import { config } from "@/data/site-config";
import { initCMS } from "@/libs/content-management";
import { Metadata } from "next";
import { notFound } from "next/navigation";

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
			<div className="rounded-3xl bg-white/70 dark:bg-gray-950/70 backdrop-blur-lg w-full max-w-4xl mx-auto md:w-4xl p-6 min-h-48 transition-colors duration-500">
				<p className="text-3xl font-bold my-2 text-black dark:text-gray-300/80 darkani">
					{page.title}
				</p>
				<div className="prose prose-ay dark:prose-invert max-w-4xl break-all my-8">
					{page.markdown_content.toReactNode()}
				</div>
				{page.enable_comment && <Comments />}
			</div>
		</>
	);
}
