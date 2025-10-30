import { HTMLAttributes, JSX } from "react";

import * as stylex from "@stylexjs/stylex";

const styles = stylex.create({
	inlineCode: {
		backgroundColor: "var(--prose-c-bg)",
		borderRadius: "0.3125rem",
		color: "var(--prose-c)",
		fontFamily: "Cascadia Mono",
		fontSize: "0.875em",
		fontWeight: 600,
		paddingBlock: "0.2em",
		paddingInline: "0.4em",
	},
	h1Code: {
		fontSize: "0.9375em",
	},
	h2Code: {
		fontSize: "0.9em",
	},
	h3Code: {
		fontSize: "0.875em",
	},
	preCode: {
		borderRadius: 0,
		borderWidth: 0,
		fontSize: "inherit",
		fontWeight: "inherit",
		lineHeight: "inherit",
		padding: 0,
		whiteSpace: "pre-wrap",
		wordWrap: "break-word",
	},
	pre: {
		backgroundColor: "var(--prose-p-bg)",
		borderRadius: "0.375rem",
		color: "var(--prose-pc)",
		fontSize: "0.875em",
		fontWeight: 400,
		lineHeight: 1.75,
		marginBottom: "1.75em",
		marginTop: "1.75em",
		paddingBottom: "0.9em",
		paddingInlineEnd: "1.25em",
		paddingInlineStart: "1.25em",
		paddingTop: "0.9em",
	},
});

export function Kbd(props: JSX.IntrinsicElements["kbd"]) {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { className, style, ...rest } = props;
	return <kbd {...stylex.props(styles.inlineCode)} {...rest} />;
}

export function Code(props: JSX.IntrinsicElements["code"] & StyleProps) {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { className, style, parent, first, last, ...rest } = props;
	return (
		<code
			{...stylex.props(
				parent === "pre" ? styles.inlineCode : styles.preCode,
				parent === "h1" && styles.h1Code,
				parent === "h2" && styles.h2Code,
				parent === "h3" && styles.h3Code
			)}
			{...rest}
		/>
	);
}

export function Pre(props: HTMLAttributes<HTMLPreElement>) {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { className, style, ...rest } = props;
	return <pre {...stylex.props(styles.pre)} {...rest} />;
}
