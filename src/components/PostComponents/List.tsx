import * as stylex from "@stylexjs/stylex";

const styles = stylex.create({
	list: {
		marginBottom: "1.25em",
		marginTop: "1.25em",
		paddingInlineStart: "1.625em",
	},
	subList: {
		marginBottom: "0.75em",
		marginTop: "0.75em",
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

export function OList(
	props: React.OlHTMLAttributes<HTMLOListElement> & StyleProps
) {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { className, style, type, parent, first, last, ...rest } = props;
	return (
		<ol
			{...stylex.props(
				styles.list,
				styles.ol1,
				type === "A" && styles.olA,
				type === "I" && styles.olI,
				type === "a" && styles.ola,
				type === "i" && styles.oli,
				parent === "list" && styles.subList
			)}
			{...rest}
		/>
	);
}

export function UList(
	props: React.OlHTMLAttributes<HTMLUListElement> & StyleProps
) {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { className, style, parent, first, last, ...rest } = props;
	return (
		<ul
			{...stylex.props(
				styles.list,
				styles.ul,
				parent === "list" && styles.subList
			)}
			{...rest}
		/>
	);
}

export function ListItem(props: React.LiHTMLAttributes<HTMLLIElement>) {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { className, style, ...rest } = props;
	return <li {...stylex.props(styles.li)} {...rest} />;
}
