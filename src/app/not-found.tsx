import { config } from "@/data/site-config";
import type { Metadata } from "next";
import Link from "next/link";
import * as stylex from "@stylexjs/stylex";

export const metadata: Metadata = {
	title: `404 - ${config.blog.title}`,
};

const style = stylex.create({
	wrap: {
		alignItems: "center",
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
	},
	text: {
		color: "var(--text)",
		fontSize: "1.875rem",
		fontWeight: 800,
		lineHeight: "2.25rem",
		marginBlock: "1rem",
	},
	button: {
		backgroundColor: "var(--primary)",
		borderRadius: "1.5rem",
		color: "lighten(var(--text), 10%)",
		cursor: "pointer",
		marginBlock: "1rem",
		marginInline: "0",
		opacity: {
			":hover": 0.9,
		},
		paddingBlock: "0.5rem",
		paddingInline: "1rem",
		transition: "opacity 0.3s ease",
	},
});

export default async function NotFound() {
	return (
		<div {...stylex.props(style.wrap)}>
			<p {...stylex.props(style.text)}>404 Not Found</p>
			<Link {...stylex.props(style.button)} href="/">
				返回首页
			</Link>
		</div>
	);
}
