"use client";

import { darkMode, isDarkMode } from "@/libs/state-management";
import { darkModeAnimation } from "@/utils/darkModeAnimation";
import { useAtom, useAtomValue } from "jotai/react";
import { useEffect, useEffectEvent } from "react";

export function DarkModeClient() {
	const theme = useAtomValue(darkMode);
	const [dark, setDark] = useAtom(isDarkMode);
	const darkModeSwitch = useEffectEvent((dark: boolean) => {
		if (dark) {
			document.getElementsByTagName("html").item(0)?.classList.add("dark");
		} else {
			document.getElementsByTagName("html").item(0)?.classList.remove("dark");
		}
	});
	useEffect(() => {
		darkModeSwitch(dark);
	}, [dark]);
	const mediaQueryHandler = useEffectEvent((media: MediaQueryList) => {
		if (theme !== "auto") {
			return;
		}
		if (media.matches) {
			setDark(true);
		} else {
			setDark(false);
		}
	});
	useEffect(() => {
		if (theme === "dark") {
			setDark(true);
			return () => {};
		}
		if (theme === "light") {
			setDark(false);
			return () => {};
		}
		const media = window.matchMedia("(prefers-color-scheme: dark)");
		mediaQueryHandler(media);
		const callback = async () => {
			await darkModeAnimation(
				window.innerWidth / 2,
				window.innerHeight / 2,
				() => {
					mediaQueryHandler(media);
				}
			);
		};
		media.addEventListener("change", callback, true);
		return () => {
			media.removeEventListener("change", callback, true);
		};
	}, [setDark, theme]);
	return <></>;
}
