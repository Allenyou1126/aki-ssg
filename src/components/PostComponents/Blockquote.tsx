import * as stylex from "@stylexjs/stylex";
import { BlockquoteHTMLAttributes } from "react";

const styles = stylex.create({
	quote: {
		borderInlineStartColor: "var(--prose-q-b)",
		borderInlineStartWidth: "0.25rem",
		color: "var(--prose-q)",
		fontStyle: "italic",
		fontWeight: 500,
		marginBottom: "1.6em",
		marginTop: "1.6em",
		paddingInlineStart: "1em",
		quotes: '"“" "”" "‘" "’"',
	},
	noTop: {
		marginTop: 0,
	},
	noBottom: {
		marginBottom: 0,
	},
});

export function Blockquote(
	props: BlockquoteHTMLAttributes<HTMLQuoteElement> & StyleProps
) {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { className, style, first, last, parent, noTop, noBottom, ...rest } =
		props;
	return (
		<blockquote
			{...stylex.props(
				styles.quote,
				noTop && styles.noTop,
				noBottom && styles.noBottom
			)}
			{...rest}
		/>
	);
}
