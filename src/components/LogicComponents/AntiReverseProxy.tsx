"use client";
import { config } from "@/data/site-config";
import { usePathname } from "next/navigation";
import { useEffect, useEffectEvent } from "react";

const extra_whitelist = ["127.0.0.1", "localhost"];

export default function AntiReverseProxy() {
	const pathname = usePathname();
	const onNavigate = useEffectEvent(() => {
		if (document.location.hostname === config.blog.hostname) {
			return;
		}
		if (extra_whitelist.includes(document.location.hostname)) {
			return;
		}
		alert("您目前访问的是未授权的镜像站点，站点上可能存在恶意内容。");
		document.location.host = config.blog.hostname;
	});
	useEffect(() => {
		onNavigate();
	}, [pathname]);
	return <></>;
}
