import type { Metadata } from "next";
import "@/styles/fonts/chillroundf.css";
import "@/styles/globals.css";
import "@/styles/normalize.css";
import { config } from "@/data/site-config";
import Navigation from "@/components/Navigation";
import CommonLogic from "@/components/LogicComponents/CommonLogic";
import { initCMS } from "@/libs/content-management";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GoToTop from "@/components/GoToTop";
import * as stylex from "@stylexjs/stylex";
import { themeTokens } from "@/styles/variables.stylex";

export const metadata: Metadata = {
	title: config.blog.title,
	description: config.blog.description,
	icons: {
		icon: config.blog.favicon,
	},
};

type Theme = {
	primary: string;
	background: string;
	background_dark: string;
};

const styles = stylex.create({
	html: {
		fontFamily: "ChillRoundF",
		scrollBehavior: "smooth",
	},
	apply: (theme: Theme) => ({
		[themeTokens.backgroundImage]: theme.background,
		[themeTokens.backgroundImageDark]: theme.background_dark,
		[themeTokens.primaryColor]: theme.primary,
	}),
	body: {
		backgroundColor: "var(--bg)",
		color: "var(--text)",
	},
	main: {
		display: "flex",
		gap: "1rem",
		justifyContent: "center",
		marginTop: "-8rem",
		position: "relative",
		width: "100%",
		zIndex: 10,
	},
	container: {
		backdropFilter: "blur(16px)",
		backgroundColor: "rgb(from var(--bg) r g b / 0.8)",
		borderRadius: "1.5rem",
		marginBlock: "0",
		marginInline: "auto",
		maxWidth: "56rem",
		minHeight: "12rem",
		padding: {
			default: "1.5rem",
			"@media (min-width: 768px)": "2rem",
		},
		width: "100%",
	},
});

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
		.toSpliced(0, 0, { title: "首页", url: "/" })
		.concat(config.extra_links);
	const theme = {
		primary: config.style.primary_color,
		background: `url("${config.style.header_image.default}")`,
		background_dark: `url("${config.style.header_image.dark}")`,
	};
	return (
		<html {...stylex.props(styles.html, styles.apply(theme))} lang="zh-CN">
			<head>
				<script
					dangerouslySetInnerHTML={{
						__html: `!function(){var t=localStorage.getItem("dark-mode"),a=document.documentElement.classList;("dark"===t||("auto"===t&&window.matchMedia("(prefers-color-scheme: dark)").matches))&&a.add("dark")}();`,
					}}
				/>
				<meta name="theme-color" content={config.style.primary_color} />
			</head>
			<body {...stylex.props(styles.body)}>
				<Navigation links={links} />
				<Header />
				<main id="main" {...stylex.props(styles.main)}>
					<div {...stylex.props(styles.container)}>{children}</div>
				</main>
				<Footer />
				<CommonLogic />
				<GoToTop />
			</body>
		</html>
	);
}
