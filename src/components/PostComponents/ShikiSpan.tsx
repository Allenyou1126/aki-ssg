export function ShikiSpan(props: React.HTMLAttributes<HTMLSpanElement>) {
	const { style, ...rest } = props;
	return <span {...rest} style={style} />;
}
