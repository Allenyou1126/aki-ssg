import type { Metadata } from "next";
import "@/styles/fonts/chillroundf.css";
import "@/styles/globals.css";
import "@/styles/normalize.css";
import { config } from "@/data/site-config";
import Navigation from "@/components/Navigation/Navigation";
import CommonLogic from "@/components/LogicComponents/CommonLogic";
import { initCMS } from "@/libs/content-management";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import GoToTop from "@/components/GoToTop/GoToTop";

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
		})
		.concat(config.extra_links);
	return (
		<html
			style={
				{
					"--primary": config.style.primary_color,
					"--bg-img": `url(${config.style.header_image.default})`,
					"--bg-img-dark": `url(${config.style.header_image.dark})`,
				} as React.CSSProperties
			}
			lang="zh-CN">
			<head>
				<script
					dangerouslySetInnerHTML={{
						__html: `!function(){var t=localStorage.getItem("dark-mode"),a=document.documentElement.classList;("dark"===t||("auto"===t&&window.matchMedia("(prefers-color-scheme: dark)").matches))&&a.add("dark")}();`,
					}}
				/>
				<meta name="theme-color" content={config.style.primary_color} />
			</head>
			<body>
				<Navigation links={links} />
				<Header />
				<main id="main">
					<div id="page-container">{children}</div>
				</main>
				<Footer />
				<CommonLogic />
				<GoToTop />
			</body>
		</html>
	);
}
