"use client";
import { scrollY } from "@/libs/state-management";
import { connectString } from "@/utils/connectString";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAtomValue } from "jotai";

export default function GoToTop() {
	const scroll = useAtomValue(scrollY);
	return (
		<button
			title="Go to Top"
			className={connectString([
				"block z-30 fixed bottom-4 right-4 rounded-2xl border-2 border-opacity-60 bg-white dark:bg-gray-950 dark:text-gray-300/80 transition-all duration-500 items-center text-center p-4 shadow-3xl",
				scroll > 500 ? "opacity-100 hover:opacity-80" : "opacity-0 invisible",
			])}
			disabled={scroll <= 500}
			onClick={() => {
				window.scrollTo({
					left: 0,
					top: 0,
					behavior: "smooth",
				});
			}}>
			<FontAwesomeIcon icon={faChevronUp} className="text-3xl" />
		</button>
	);
}
