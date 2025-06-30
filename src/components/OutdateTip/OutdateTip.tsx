"use client";

import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import style from "./style.module.css";

export default function OutdateTip({ created }: { created: string }) {
	const created_at = new Date(created);
	const current = new Date();
	const val = Math.ceil(
		(current.getTime() - created_at.getTime()) / (1000 * 60 * 60 * 24)
	);
	const vis = val >= 365;
	return (
		<p
			suppressHydrationWarning
			style={{ display: vis ? "block" : "none" }}
			className={style.tip}>
			<FontAwesomeIcon icon={faInfoCircle} /> 本文最后修改于 {val}{" "}
			天前，请注意文章内容的时效性。
		</p>
	);
}
