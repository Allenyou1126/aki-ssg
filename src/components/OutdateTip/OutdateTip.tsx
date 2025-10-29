"use client";

import { themeTokens } from "@/styles/variables.stylex";
import * as stylex from "@stylexjs/stylex";

const style = stylex.create({
	icon: {
		display: "inline-block",
		fill: "currentColor",
		height: "1em",
		width: "1em",
	},
	tip: {
		backdropFilter: "blur(24px)",
		backgroundColor: `rgb(from ${themeTokens.primaryColor} r g b / 0.8)`,
		borderRadius: "1rem",
		overflow: "hidden",
		padding: "1rem",
		verticalAlign: "baseline",
	},
});

function Icon() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			{...stylex.props(style.icon)}
			viewBox="0 0 512 512">
			<path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
		</svg>
	);
}

export default function OutdateTip({ created }: { created: string }) {
	const created_at = new Date(created);
	const current = new Date();
	const val = Math.ceil(
		(current.getTime() - created_at.getTime()) / (1000 * 60 * 60 * 24)
	);
	const vis = val >= 365;
	return (
		<p
			suppressHydrationWarning
			style={{ display: vis ? "block" : "none" }}
			{...stylex.props(style.tip)}>
			<Icon /> 本文最后修改于 {val} 天前，请注意文章内容的时效性。
		</p>
	);
}
