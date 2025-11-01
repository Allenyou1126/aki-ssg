import { config } from "@/data/site-config";
import { Link } from "@/components/PostComponents/Link";
import * as stylex from "@stylexjs/stylex";

const style = stylex.create({
	icon: {
		fill: "currentColor",
		height: "180px",
		opacity: 0.3,
		position: "absolute",
		right: "-2rem",
		top: "-2rem",
		width: "180px",
	},
	wrap: {
		backgroundColor: "var(--copyright-bg)",
		borderRadius: "1.5rem",
		marginBlock: "2rem",
		marginInline: "-1.5rem",
		overflow: "hidden",
		padding: "1.5rem",
		position: "relative",
	},
	title: {
		fontSize: "1.125rem",
		fontWeight: 500,
		lineHeight: "1.75rem",
	},
	grid: {
		display: "flex",
		flexDirection: "row",
		flexWrap: "nowrap",
		gap: "1rem",
		justifyContent: "flex-start",
		marginTop: "1rem",
	},
	label: {
		fontWeight: 700,
		gridRow: "span 1 / span 1",
	},
	text: {
		gridRow: "span 2 / span 2",
	},
});

function Icon() {
	return (
		<svg
			{...stylex.props(style.icon)}
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 496 512">
			<path d="M245.8 214.9l-33.2 17.3c-9.4-19.6-25.2-19.9-27.5-19.9-22.1 0-33.2 14.6-33.2 43.8 0 23.6 9.2 43.8 33.2 43.8 14.5 0 24.7-7.1 30.6-21.3l30.6 15.5c-6.2 11.5-25.7 39-65.1 39-22.6 0-74-10.3-74-77.1 0-58.7 43-77.1 72.6-77.1 30.7 0 52.7 12 66 35.9zm143.1 0l-32.8 17.3c-9.5-19.8-25.7-19.9-27.9-19.9-22.1 0-33.2 14.6-33.2 43.8 0 23.6 9.2 43.8 33.2 43.8 14.5 0 24.7-7.1 30.5-21.3l31 15.5c-2.1 3.8-21.4 39-65.1 39-22.7 0-74-9.9-74-77.1 0-58.7 43-77.1 72.6-77.1 30.7 0 52.6 12 65.6 35.9zM247.6 8.1C104.7 8.1 0 123.1 0 256.1c0 138.5 113.6 248 247.6 248 129.9 0 248.4-100.9 248.4-248 0-137.9-106.6-248-248.4-248zm.9 450.8c-112.5 0-203.7-93-203.7-202.8 0-105.4 85.4-203.3 203.7-203.3 112.5 0 202.8 89.5 202.8 203.3 0 121.7-99.7 202.8-202.8 202.8z" />
		</svg>
	);
}

export default async function Copyright({
	title,
	id,
	cc,
}: {
	title: string;
	id: number;
	cc?: string;
}) {
	return (
		<div {...stylex.props(style.wrap)}>
			<p {...stylex.props(style.title)}>{title}</p>
			<Link
				href={`https://${config.blog.hostname}/post/${id}`}>{`https://${config.blog.hostname}/post/${id}`}</Link>
			<div {...stylex.props(style.grid)}>
				<div>
					<p {...stylex.props(style.label)}>本文作者</p>
					<p {...stylex.props(style.text)}>{config.author.name}</p>
				</div>
				<div>
					<p {...stylex.props(style.label)}>授权协议</p>
					<p {...stylex.props(style.text)}>{cc ?? "CC BY-NC-SA 4.0"}</p>
				</div>
			</div>
			<Icon />
		</div>
	);
}
