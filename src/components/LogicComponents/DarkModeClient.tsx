"use client";

import { darkMode, isDarkMode } from "@/libs/state-management";
import { darkModeAnimation } from "@/utils/darkModeAnimation";
import { usePreferDark } from "@/utils/useMediaQuery";
import { useAtom, useAtomValue } from "jotai/react";
import { useEffect, useEffectEvent } from "react";

export function DarkModeClient() {
	const theme = useAtomValue(darkMode);
	const [dark, setDark] = useAtom(isDarkMode);
	const prefersDark = usePreferDark();
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
	useEffect(() => {
		if (theme === "dark") {
			setDark(true);
			return;
		}
		if (theme === "light") {
			setDark(false);
			return;
		}
		darkModeAnimation(window.innerWidth / 2, window.innerHeight / 2, () => {
			setDark(prefersDark);
		});
	}, [setDark, theme, prefersDark]);
	return <></>;
}
