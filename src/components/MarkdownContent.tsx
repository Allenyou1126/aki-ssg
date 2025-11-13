import * as stylex from "@stylexjs/stylex";

const styles = stylex.create({
	prose: {
		color: "var(--prose-bd)",
		fontSize: "1rem",
		lineHeight: 1.75,
		marginBlock: "2rem",
		marginInline: "auto",
		maxWidth: "56rem",
		wordBreak: "break-all",
	},
	comment: {
		fontSize: "0.9rem",
		lineHeight: 1.5,
		marginBlock: "0.5rem",
		marginInline: "auto",
		maxWidth: "none",
		width: "100%",
	},
});

export function MarkdownContent({
	children,
	comment,
}: {
	readonly children: React.ReactNode;
	readonly comment?: boolean;
}) {
	return (
		<div data-prose {...stylex.props(styles.prose, comment && styles.comment)}>
			{children}
		</div>
	);
}
