import loader from "./style.module.css";

export function Loading() {
	return (
		<div className={loader.wrap}>
			<div className={loader.loader} />
		</div>
	);
}
