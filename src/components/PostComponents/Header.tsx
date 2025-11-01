import * as stylex from "@stylexjs/stylex";
import { HTMLAttributes } from "react";

const styles = stylex.create({
	h: {
		color: "var(--prose-h)",
	},
	h1: {
		fontSize: "2.25em",
		fontWeight: 800,
		lineHeight: 1.1111111,
		marginBottom: "0.8888889em",
		marginTop: 0,
	},
	h2: {
		fontSize: "1.5em",
		fontWeight: 700,
		lineHeight: 1.3333333,
		marginBottom: "1em",
		marginTop: "2em",
	},
	h3: {
		fontSize: "1.25em",
		fontWeight: 600,
		lineHeight: 1.6,
		marginBottom: "0.6em",
		marginTop: "1.6em",
	},
	h4: {
		fontWeight: 600,
		lineHeight: 1.5,
		marginBottom: "0.5em",
		marginTop: "1.5em",
	},
	noTop: {
		marginTop: 0,
	},
	noBottom: {
		marginBottom: 0,
	},
});

export function H1(props: HTMLAttributes<HTMLHeadingElement> & StyleProps) {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { className, style, first, last, parent, noTop, noBottom, ...rest } =
		props;
	return (
		<h1
			{...stylex.props(
				styles.h,
				styles.h1,
				noTop && styles.noTop,
				noBottom && styles.noBottom
			)}
			{...rest}
		/>
	);
}
export function H2(props: HTMLAttributes<HTMLHeadingElement> & StyleProps) {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { className, style, first, last, parent, noTop, noBottom, ...rest } =
		props;
	return (
		<h2
			{...stylex.props(
				styles.h,
				styles.h2,
				noTop && styles.noTop,
				noBottom && styles.noBottom
			)}
			{...rest}
		/>
	);
}
export function H3(props: HTMLAttributes<HTMLHeadingElement> & StyleProps) {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { className, style, first, last, parent, noTop, noBottom, ...rest } =
		props;
	return (
		<h3
			{...stylex.props(
				styles.h,
				styles.h3,
				noTop && styles.noTop,
				noBottom && styles.noBottom
			)}
			{...rest}
		/>
	);
}
export function H4(props: HTMLAttributes<HTMLHeadingElement> & StyleProps) {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { className, style, first, last, parent, noTop, noBottom, ...rest } =
		props;
	return (
		<h4
			{...stylex.props(
				styles.h,
				styles.h4,
				noTop && styles.noTop,
				noBottom && styles.noBottom
			)}
			{...rest}
		/>
	);
}
