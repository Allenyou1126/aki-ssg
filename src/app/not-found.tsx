import { config } from "@/data/site-config";
import type { Metadata } from "next";
import Link from "next/link";
import style from "@/styles/not-found.module.css";

export const metadata: Metadata = {
	title: `404 - ${config.blog.title}`,
};

export default async function NotFound() {
	return (
		<div className={style.wrap}>
			<p className={style.text}>404 Not Found</p>
			<Link className={style.button} href="/">
				返回首页
			</Link>
		</div>
	);
}
