"use client";

import { darkMode, isDarkMode } from "@/libs/state-management";
import { darkModeAnimation } from "@/utils/darkModeAnimation";
import { usePreferDark } from "@/utils/useMediaQuery";
import { useAtom, useAtomValue } from "jotai/react";
import { useEffectEvent, useLayoutEffect, useState } from "react";

export function DarkModeClient() {
	const theme = useAtomValue(darkMode);
	const [dark, setDark] = useAtom(isDarkMode);
	const [auto, setAuto] = useState(() => theme === "auto");
	const prefersDark = usePreferDark();
	const darkModeSwitch = useEffectEvent((dark: boolean) => {
		if (dark) {
			document.getElementsByTagName("html").item(0)?.classList.add("dark");
		} else {
			document.getElementsByTagName("html").item(0)?.classList.remove("dark");
		}
	});
	useLayoutEffect(() => {
		darkModeSwitch(dark);
	}, [dark]);
	useLayoutEffect(() => {
		if (theme === "dark") {
			setDark(true);
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setAuto(false);
			return;
		}
		if (theme === "light") {
			setDark(false);
			setAuto(false);
			return;
		}
		if (!auto) {
			setDark(prefersDark);
			setAuto(true);
			return;
		}
	}, [setDark, theme, prefersDark, dark, auto]);
	useLayoutEffect(() => {
		if (!auto) {
			return;
		}
		if (dark === prefersDark) {
			return;
		}
		darkModeAnimation(window.innerWidth / 2, window.innerHeight / 2, () => {
			setDark(prefersDark);
		});
	}, [auto, dark, prefersDark, setDark]);
	return <></>;
}
