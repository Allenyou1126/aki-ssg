import * as stylex from "@stylexjs/stylex";
import { JSX } from "react";

const styles = stylex.create({
	strong: {
		color: "inherit",
		fontWeight: 600,
	},
	h1Strong: {
		fontWeight: 900,
	},
	h2Strong: {
		fontWeight: 800,
	},
	h3Strong: {
		fontWeight: 700,
	},
});

export function Strong(props: JSX.IntrinsicElements["strong"] & StyleProps) {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { className, style, parent, first, last, ...rest } = props;
	return (
		<strong
			{...stylex.props(
				styles.strong,
				parent === "h1" && styles.h1Strong,
				parent === "h2" && styles.h2Strong,
				(parent === "h3" || parent === "h4") && styles.h3Strong
			)}
			{...rest}
		/>
	);
}
