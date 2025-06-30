"use client";
import { scrollY } from "@/libs/state-management";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAtomValue } from "jotai";
import style from "./style.module.css";

export default function GoToTop() {
	const scroll = useAtomValue(scrollY);
	return (
		<button
			title="Go to Top"
			style={{
				opacity: scroll <= 500 ? 0 : undefined,
				visibility: scroll <= 500 ? "hidden" : undefined,
			}}
			className={style.top}
			disabled={scroll <= 500}
			onClick={() => {
				window.scrollTo({
					left: 0,
					top: 0,
					behavior: "smooth",
				});
			}}>
			<FontAwesomeIcon icon={faChevronUp} />
		</button>
	);
}
