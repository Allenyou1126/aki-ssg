import * as stylex from "@stylexjs/stylex";

const styles = stylex.create({
	hr: {
		borderColor: "var(--prose-hr)",
		borderTopWidth: "1px",
		marginBottom: "3em",
		marginTop: "3em",
	},
});

export function Hr(props: React.HtmlHTMLAttributes<HTMLHRElement>) {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { className, style, ...rest } = props;
	return <hr {...stylex.props(styles.hr)} {...rest} />;
}
