import { Loading } from "../Loading/Loading";
import style from "./style.module.css";

export function CommentsLoading() {
	return (
		<>
			<div className={style.loading}>
				<Loading />
				<p className={style.text}>加载评论中……</p>
			</div>
		</>
	);
}
