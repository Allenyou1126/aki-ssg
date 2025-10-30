import * as stylex from "@stylexjs/stylex";

const styles = stylex.create({
	table: {
		fontSize: "0.875em",
		lineHeight: 1.75,
		marginBottom: "2em",
		marginTop: "2em",
		tableLayout: "auto",
		width: "100%",
	},
	thead: {
		borderBottomColor: "var(--prose-th-b)",
		borderBottomWidth: "1px",
	},
	tfoot: {
		borderTopColor: "var(--prose-th-b)",
		borderTopWidth: "1px",
	},
	tbody: {},
	th: {
		color: "var(--prose-h)",
		fontWeight: 600,
		paddingBottom: "0.6em",
		paddingInlineEnd: "0.6em",
		paddingInlineStart: "0.6em",
		textAlign: "start",
		verticalAlign: "bottom",
	},
	thFirst: {
		paddingInlineStart: 0,
	},
	thLast: {
		paddingInlineEnd: 0,
	},
	td: {
		padding: "0.6em",
	},
	tdTbd: {
		verticalAlign: "baseline",
	},
	tdTfoot: {
		verticalAlign: "top",
	},
	tr: {
		borderBottomColor: "var(--prose-td-b)",
		borderBottomWidth: "1px",
	},
	trLast: {
		borderBottomWidth: 0,
	},
});

export function Table(props: React.TableHTMLAttributes<HTMLTableElement>) {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { className, style, ...rest } = props;
	return <table {...stylex.props(styles.table)} {...rest} />;
}

export function THead(props: React.HTMLAttributes<HTMLTableSectionElement>) {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { className, style, ...rest } = props;
	return <thead {...stylex.props(styles.thead)} {...rest} />;
}

export function TFoot(props: React.HTMLAttributes<HTMLTableSectionElement>) {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { className, style, ...rest } = props;
	return <tfoot {...stylex.props(styles.tfoot)} {...rest} />;
}

export function TBody(props: React.HTMLAttributes<HTMLTableSectionElement>) {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { className, style, ...rest } = props;
	return <tbody {...stylex.props(styles.tbody)} {...rest} />;
}

export function Th(
	props: React.ThHTMLAttributes<HTMLTableCellElement> & StyleProps
) {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { className, style, first, last, parent, ...rest } = props;
	return (
		<th
			{...stylex.props(
				styles.th,
				first && styles.thFirst,
				last && styles.thLast
			)}
			{...rest}
		/>
	);
}

export function Tr(
	props: React.HTMLAttributes<HTMLTableRowElement> & StyleProps
) {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { className, style, first, last, parent, ...rest } = props;
	return <tr {...stylex.props(styles.tr, last && styles.trLast)} {...rest} />;
}

export function Td(
	props: React.TdHTMLAttributes<HTMLTableCellElement> & StyleProps
) {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { className, style, first, last, parent, ...rest } = props;
	return (
		<td
			{...stylex.props(
				styles.td,
				parent === "tbody" && styles.tdTbd,
				parent === "tfoot" && styles.tdTfoot,
				first && styles.thFirst,
				last && styles.thLast
			)}
			{...rest}
		/>
	);
}
