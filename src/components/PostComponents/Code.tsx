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
		color: "#abb2bf",
		display: "block",
		fontFamily: "Cascadia Mono",
		fontSize: "inherit",
		fontWeight: "inherit",
		lineHeight: "inherit",
		overflowX: "auto",
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
	noTop: {
		marginTop: 0,
	},
	noBottom: {
		marginBottom: 0,
	},
});

export function Kbd(props: JSX.IntrinsicElements["kbd"] & StyleProps) {
	const { parent, noTop, noBottom, ...rest } = props;
	return (
		<kbd
			{...stylex.props(
				styles.inlineCode,
				parent === "h1" && styles.h1Code,
				parent === "h2" && styles.h2Code,
				parent === "h3" && styles.h3Code,
				noTop && styles.noTop,
				noBottom && styles.noBottom
			)}
			{...rest}
		/>
	);
}

export function Code(props: JSX.IntrinsicElements["code"] & StyleProps) {
	const { className, parent, noTop, noBottom, ...rest } = props;
	return (
		<code
			{...stylex.props(
				parent === "pre" ? styles.preCode : styles.inlineCode,
				parent === "h1" && styles.h1Code,
				parent === "h2" && styles.h2Code,
				parent === "h3" && styles.h3Code,
				noTop && styles.noTop,
				noBottom && styles.noBottom
			)}
			{...rest}
			data-language={
				className && className.startsWith("language-")
					? className.substring(9)
					: undefined
			}
		/>
	);
}

export function Pre(props: HTMLAttributes<HTMLPreElement> & StyleProps) {
	const { noTop, noBottom, ...rest } = props;
	return (
		<pre
			{...stylex.props(
				styles.pre,
				noTop && styles.noTop,
				noBottom && styles.noBottom
			)}
			{...rest}
		/>
	);
}
