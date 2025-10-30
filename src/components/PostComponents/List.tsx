import * as stylex from "@stylexjs/stylex";

const styles = stylex.create({
	list: {
		marginBottom: "1.25em",
		marginTop: "1.25em",
		paddingInlineStart: "1.625em",
	},
	ol1: {
		listStyleType: "decimal",
	},
	olA: {
		listStyleType: "upper-alpha",
	},
	ola: {
		listStyleType: "lower-alpha",
	},
	olI: {
		listStyleType: "upper-roman",
	},
	oli: {
		listStyleType: "lower-roman",
	},
	ul: {
		listStyleType: "disc",
	},
	li: {
		color: "var(--prose-cnt)",
		fontWeight: 400,
		marginBottom: "0.5em",
		marginTop: "0.5em",
		paddingInlineStart: "0.375em",
	},
});

export function OList(props: React.OlHTMLAttributes<HTMLOListElement>) {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { className, style, type, ...rest } = props;
	return (
		<ol
			{...stylex.props(
				styles.list,
				styles.ol1,
				type === "A" && styles.olA,
				type === "I" && styles.olI,
				type === "a" && styles.ola,
				type === "i" && styles.oli
			)}
			{...rest}
		/>
	);
}

export function UList(props: React.OlHTMLAttributes<HTMLUListElement>) {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { className, style, ...rest } = props;
	return <ul {...stylex.props(styles.list, styles.ul)} {...rest} />;
}

export function ListItem(props: React.LiHTMLAttributes<HTMLLIElement>) {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { className, style, ...rest } = props;
	return <li {...stylex.props(styles.li)} {...rest} />;
}
