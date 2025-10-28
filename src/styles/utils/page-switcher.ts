import * as stylex from "@stylexjs/stylex";

export const pageSwitcher = stylex.create({
	common: {
		fontSize: "1rem",
		lineHeight: "1.5rem",
		position: "absolute",
		top: "50%",
		transform: "translateY(-50%)",
	},
	button: {
		backgroundColor: "var(--primary)",
		borderRadius: "1.5rem",
		color: "rgba(255 255 255 1)",
		cursor: "pointer",
		fontSize: "1rem",
		opacity: {
			":hover": 0.9,
		},
		paddingBlock: "0.5rem",
		paddingInline: "1rem",
		textDecoration: "none",
		transition: "background-color 0.2s",
	},
	wrap: {
		height: "3rem",
		marginTop: "2rem",
		position: "relative",
	},
	page: {
		left: 0,
		margin: "auto",
		right: 0,
		textAlign: "center",
	},
});
