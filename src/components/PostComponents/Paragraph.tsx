import * as stylex from "@stylexjs/stylex";
import { HTMLAttributes } from "react";

const styles = stylex.create({
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
});

export function Paragraph(
	props: HTMLAttributes<HTMLParagraphElement> & StyleProps
) {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { className, style, first, last, parent, ...rest } = props;
	return (
		<p
			{...stylex.props(
				parent === "listItem" && styles.midLiParagraph,
				parent === "listItem" && first && styles.firstLiParagraph,
				parent === "listItem" && last && styles.lastLiParagraph
			)}
			{...rest}
		/>
	);
}
