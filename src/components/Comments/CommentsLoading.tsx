import { Loading } from "../Loading/Loading";
import * as stylex from "@stylexjs/stylex";

const style = stylex.create({
	loading: {
		alignItems: "center",
		display: "flex",
		flexDirection: "column",
		gap: "1rem",
		justifyContent: "center",
		marginTop: "1rem",
		width: "100%",
	},
	text: {
		fontSize: "1.25rem",
		fontWeight: 700,
		lineHeight: "1.75rem",
	},
});

export function CommentsLoading() {
	return (
		<>
			<div {...stylex.props(style.loading)}>
				<Loading />
				<p {...stylex.props(style.text)}>加载评论中……</p>
			</div>
		</>
	);
}
