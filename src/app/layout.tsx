import type { Metadata } from "next";
import "@/styles/globals.css";
import { config } from "@/data/site-config";
import Navigation from "@/components/Navigation";
import CommonLogic from "@/components/LogicComponents/CommonLogic";
import { initCMS } from "@/libs/content-management";

export const metadata: Metadata = {
	title: config.blog.title,
	description: config.blog.description,
	icons: {
		icon: config.blog.favicon,
	},
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const cms = await initCMS();
	const links = cms
		.getPages()
		.filter((p) => p.navigation_title !== undefined)
		.sort((a, b) => a.navigation_index - b.navigation_index)
		.map((p) => {
			return {
				title: p.navigation_title!,
				url: `/${p.slug}`,
			};
		});
	return (
		<html className="font-crf scroll-smooth" lang="zh-CN">
			<body className="dark:bg-gray-950 dark:text-gray-300/80 transition-colors duration-500">
				<Navigation links={links} />
				{children}
				<CommonLogic />
			</body>
		</html>
	);
}
