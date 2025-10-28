"use client";
import { scrollY } from "@/libs/state-management";
import { useAtomValue } from "jotai";
import * as stylex from "@stylexjs/stylex";

function Icon() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="1em"
			height="1em"
			fill="currentColor"
			viewBox="0 0 512 512">
			<path d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z" />
		</svg>
	);
}

const style = stylex.create({
	top: {
		backgroundColor: "var(--bg)",
		borderColor: "rgb(from var(--border) r g b / 0.8)",
		borderRadius: "1rem",
		borderWidth: "2px",
		bottom: "1rem",
		display: "block",
		fontSize: "1.875rem",
		justifyItems: "center",
		lineHeight: "2.25rem",
		opacity: {
			":hover": 0.8,
		},
		padding: "1rem",
		position: "fixed",
		right: "1rem",
		textAlign: "center",
		transition:
			"opacity 500ms cubic-bezier(0.4, 0, 0.2, 1), visibility 500ms cubic-bezier(0.4, 0, 0.2, 1);",
		zIndex: 30,
	},
});

export default function GoToTop() {
	const scroll = useAtomValue(scrollY);
	return (
		<button
			title="Go to Top"
			style={{
				opacity: scroll <= 500 ? 0 : undefined,
				visibility: scroll <= 500 ? "hidden" : undefined,
			}}
			{...stylex.props(style.top)}
			disabled={scroll <= 500}
			onClick={() => {
				window.scrollTo({
					left: 0,
					top: 0,
					behavior: "smooth",
				});
			}}>
			<Icon />
		</button>
	);
}
