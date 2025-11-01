import { config } from "@/data/site-config";
import Link from "next/link";
import * as stylex from "@stylexjs/stylex";

const style = stylex.create({
	footer: {
		alignItems: "center",
		bottom: 0,
		display: "flex",
		flexDirection: "column",
		gap: "0.75rem",
		justifyContent: "center",
		marginBlock: "0.75rem",
		marginInline: "0",
		paddingBlock: "1rem",
		paddingInline: "0",
		position: "relative",
		textAlign: "center",
		width: "100%",
	},
	secondary: {
		opacity: 0.7,
	},
	wrap: {
		display: "flex",
		flexDirection: "row",
		flexWrap: "nowrap",
		gap: "2rem",
	},
	link: {
		display: "block",
	},
});

export default async function Footer() {
	return (
		<footer {...stylex.props(style.footer)}>
			<p>
				Copyright © {config.blog.begin_year}-{new Date().getFullYear()}{" "}
				{config.author.name}
			</p>
			<p {...stylex.props(style.secondary)}>
				Powered by{" "}
				<Link href="https://github.com/Allenyou1126/aki-ssg">Aki-SSG</Link>
			</p>
			<p {...stylex.props(style.secondary)}>
				Last Build: {new Date().toLocaleString()}
			</p>
			<div {...stylex.props(style.secondary, style.wrap)}>
				<Link {...stylex.props(style.link)} href="/feed.xml">
					RSS Feed
				</Link>
				<Link {...stylex.props(style.link)} href="/sitemap.xml">
					Sitemap
				</Link>
			</div>
		</footer>
	);
}
