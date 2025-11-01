import { config } from "@/data/site-config";
import Link from "next/link";
import * as stylex from "@stylexjs/stylex";
import { themeTokens } from "@/styles/variables.stylex";

const styles = stylex.create({
	header: {
		backgroundColor: themeTokens.primaryColor,
		backgroundImage: {
			default: themeTokens.backgroundImage,
			":is(.dark *)": themeTokens.backgroundImageDark,
		},
		backgroundPosition: "top",
		backgroundSize: "cover",
		display: "flex",
		filter: {
			":is(.dark *)": "brightness(0.7)",
		},
		flexDirection: "column",
		height: "calc(65lvh + 8rem)",
		minHeight: "30rem",
		zIndex: 0,
	},
	wrap: {
		flex: "1 1 auto",
		position: "relative",
	},
	gradient: {
		backgroundImage: "linear-gradient(to bottom, transparent, var(--bg))",
		flex: "none",
		height: "8rem",
		width: "100%",
	},
	meta: {
		bottom: "2.5rem",
		color: {
			default: "rgb(255 255 255 / 1)",
			":is(.dark *)": "rgb(209 213 219 / 1)",
		},
		left: "50%",
		maxWidth: "56rem",
		paddingBlock: 0,
		paddingInline: {
			default: "1.25rem",
			"@media (min-width: 768px)": "1.5rem",
		},
		position: "absolute",
		transform: "translateX(-50%)",
		width: "100%",
		zIndex: 10,
	},
	text: {
		filter:
			"drop-shadow(0 20px 13px rgb(0 0 0 / 0.03)) drop-shadow(0 8px 5px rgb(0 0 0 / 0.08))",
		lineHeight: 1.5,
	},
	title: {
		fontSize: "2.25rem",
		fontWeight: 700,
	},
	description: {
		fontSize: "1rem",
		marginTop: "0.25rem",
	},
});

export default async function Header() {
	return (
		<header {...stylex.props(styles.header)}>
			<div {...stylex.props(styles.wrap)}>
				<div {...stylex.props(styles.meta)}>
					<h1 {...stylex.props(styles.text, styles.title)}>
						<Link href="/">{config.blog.title}</Link>
					</h1>
					<p {...stylex.props(styles.text, styles.description)}>
						{config.blog.description}
					</p>
				</div>
			</div>
			<div {...stylex.props(styles.gradient)}></div>
		</header>
	);
}
