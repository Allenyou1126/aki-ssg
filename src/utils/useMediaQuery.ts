/** @see https://foxact.skk.moe/use-media-query */

"use client";

import { useCallback, useSyncExternalStore } from "react";

const externalStore = new Map<string, boolean>(); // External store to hold the state of each media query

function subscribeToMediaQuery(mq: string, callback: VoidFunction) {
	if (typeof window === "undefined") return () => {};

	const mediaQueryList = window.matchMedia(mq);

	const handleChange = () => {
		// update the store with the latest value of a media query
		externalStore.set(mq, mediaQueryList.matches);
		callback();
	};

	mediaQueryList.addEventListener("change", handleChange); // Add change listener to MediaQueryList

	return () => {
		mediaQueryList.removeEventListener("change", handleChange); // Cleanup function to remove listener
	};
}

function getServerSnapshotWithoutServerValue(): never {
	throw new Error(
		"useMediaQuery cannot be used on the server without a serverValue"
	);
}

export function useMediaQuery(mq: string, serverValue?: boolean): boolean {
	if (typeof window !== "undefined" && !externalStore.has(mq)) {
		externalStore.set(mq, window.matchMedia(mq).matches);
	}

	// subscribe once per hook per media query
	const subscribe = useCallback(
		(callback: VoidFunction) => subscribeToMediaQuery(mq, callback),
		[mq]
	);

	const getSnapshot = () => {
		if (typeof window === "undefined") {
			return false;
		}
		return externalStore.get(mq) ?? window.matchMedia(mq).matches;
	};
	const getServerSnapshot =
		serverValue === undefined
			? getServerSnapshotWithoutServerValue
			: () => serverValue;

	return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function usePreferDark() {
	return useMediaQuery("(prefers-color-scheme: dark)", false);
}
