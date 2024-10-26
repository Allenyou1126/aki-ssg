"use client";

import dynamic from "next/dynamic";

export const Matomo = dynamic(() => import("./MatomoInner"), {
	ssr: false,
});
