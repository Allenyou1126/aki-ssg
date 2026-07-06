"use client";

import { scrollY } from "@/libs/state-management";
import { throttle } from "@/utils/throttle";
import { useSetAtom } from "jotai";
import { useEffectEvent, useLayoutEffect } from "react";

export function ScrollClient() {
    const setScrollY = useSetAtom(scrollY);
    const handler = useEffectEvent(
        throttle(() => {
            setScrollY(window.scrollY);
        }, 100),
    );
    useLayoutEffect(() => {
        setScrollY(window.scrollY);
        window.addEventListener("scroll", handler, true);
        return () => {
            window.removeEventListener("scroll", handler);
        };
    }, [setScrollY]);
    return <></>;
}
