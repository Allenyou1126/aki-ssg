import * as stylex from "@stylexjs/stylex";

const styles = stylex.create({
	hr: {
		borderColor: "var(--prose-hr)",
		borderTopWidth: "1px",
		marginBottom: "3em",
		marginTop: "3em",
	},
	noTop: {
		marginTop: 0,
	},
	noBottom: {
		marginBottom: 0,
	},
});

export function Hr(
	props: React.HtmlHTMLAttributes<HTMLHRElement> & StyleProps
) {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { className, style, parent, first, last, noTop, noBottom, ...rest } =
		props;
	return (
		<hr
			{...stylex.props(
				styles.hr,
				noTop && styles.noTop,
				noBottom && styles.noBottom
			)}
			{...rest}
		/>
	);
}
