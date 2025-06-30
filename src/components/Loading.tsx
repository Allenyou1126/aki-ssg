import loader from "@/styles/utils/loader.module.css";

export function Loading() {
	return (
		<div className={loader.wrap}>
			<div className={loader.loader} />
		</div>
	);
}
