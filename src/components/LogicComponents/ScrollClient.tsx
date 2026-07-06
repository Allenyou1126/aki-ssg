"use client";

import { scrollY } from "@/libs/state-management";
import { throttle } from "@/utils/throttle";
import { useSetAtom } from "jotai";
import { useEffectEvent, useLayoutEffect } from "react";

export function ScrollClient() {
    const setScrollY = useSetAtom(scrollY);
    const handler = useEffectEvent(
        throttle(() => {
            setScrollY(
                document.body.scrollTop ||
                    document.documentElement.scrollTop ||
                    0,
            );
        }, 10),
    );
    useLayoutEffect(() => {
        setScrollY(
            document.body.scrollTop || document.documentElement.scrollTop || 0,
        );
        document.addEventListener("scroll", handler, true);
        return () => {
            document.removeEventListener("scroll", handler);
        };
    }, [setScrollY]);
    return <></>;
}
