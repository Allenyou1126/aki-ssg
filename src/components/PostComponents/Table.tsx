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
	noTop: {
		marginTop: 0,
	},
	noBottom: {
		marginBottom: 0,
	},
});

export function Table(
	props: React.TableHTMLAttributes<HTMLTableElement> & StyleProps
) {
	const { noTop, noBottom, ...rest } = props;
	return (
		<table
			{...stylex.props(
				styles.table,
				noTop && styles.noTop,
				noBottom && styles.noBottom
			)}
			{...rest}
		/>
	);
}

export function THead(
	props: React.HTMLAttributes<HTMLTableSectionElement> & StyleProps
) {
	const { noTop, noBottom, ...rest } = props;
	return (
		<thead
			{...stylex.props(
				styles.thead,
				noTop && styles.noTop,
				noBottom && styles.noBottom
			)}
			{...rest}
		/>
	);
}

export function TFoot(
	props: React.HTMLAttributes<HTMLTableSectionElement> & StyleProps
) {
	const { noTop, noBottom, ...rest } = props;
	return (
		<tfoot
			{...stylex.props(
				styles.tfoot,
				noTop && styles.noTop,
				noBottom && styles.noBottom
			)}
			{...rest}
		/>
	);
}

export function TBody(
	props: React.HTMLAttributes<HTMLTableSectionElement> & StyleProps
) {
	const { noTop, noBottom, ...rest } = props;
	return (
		<tbody
			{...stylex.props(
				styles.tbody,
				noTop && styles.noTop,
				noBottom && styles.noBottom
			)}
			{...rest}
		/>
	);
}

export function Th(
	props: React.ThHTMLAttributes<HTMLTableCellElement> & StyleProps
) {
	const { first, last, noTop, noBottom, ...rest } = props;
	return (
		<th
			{...stylex.props(
				styles.th,
				first && styles.thFirst,
				last && styles.thLast,
				noTop && styles.noTop,
				noBottom && styles.noBottom
			)}
			{...rest}
		/>
	);
}

export function Tr(
	props: React.HTMLAttributes<HTMLTableRowElement> & StyleProps
) {
	const { last, noTop, noBottom, ...rest } = props;
	return (
		<tr
			{...stylex.props(
				styles.tr,
				last && styles.trLast,
				noTop && styles.noTop,
				noBottom && styles.noBottom
			)}
			{...rest}
		/>
	);
}

export function Td(
	props: React.TdHTMLAttributes<HTMLTableCellElement> & StyleProps
) {
	const { first, last, parent, ...rest } = props;
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
