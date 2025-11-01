import * as stylex from "@stylexjs/stylex";
import { HTMLAttributes } from "react";

const styles = stylex.create({
	p: {
		marginBottom: "1.25em",
		marginTop: "1.25em",
	},
	firstLiParagraph: {
		marginTop: "1.25em",
	},
	lastLiParagraph: {
		marginBottom: "1.25em",
	},
	midLiParagraph: {
		marginBottom: "0.75em",
		marginTop: "0.75em",
	},
	firstQuoteParagraph: {
		"::before": {
			content: "open-quote",
		},
	},
	lastQuoteParagraph: {
		"::after": {
			content: "close-quote",
		},
	},
});

export function Paragraph(
	props: HTMLAttributes<HTMLParagraphElement> & StyleProps
) {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { className, style, first, last, parent, ...rest } = props;
	return (
		<p
			{...stylex.props(
				styles.p,
				parent === "listItem" && styles.midLiParagraph,
				parent === "listItem" && first && styles.firstLiParagraph,
				parent === "listItem" && last && styles.lastLiParagraph,
				parent === "blockquote" && first && styles.firstQuoteParagraph,
				parent === "blockquote" && last && styles.lastQuoteParagraph
			)}
			{...rest}
		/>
	);
}
