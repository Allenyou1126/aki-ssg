import { config } from "@/data/site-config";
import Link from "next/link";
import style from "./style.module.css";

export default async function Footer() {
	return (
		<footer className={style.footer}>
			<p>
				Copyright © {config.blog.begin_year}-{new Date().getFullYear()}{" "}
				{config.author.name}
			</p>
			<p className={style.secondary}>
				Powered by{" "}
				<Link href="https://github.com/Allenyou1126/aki-ssg">Aki-SSG</Link>
			</p>
			<p className={style.secondary}>
				Last Build: {new Date().toLocaleString()}
			</p>
			<div className={style.wrap}>
				<Link className={style.link} href="/feed.xml">
					RSS Feed
				</Link>
				<Link className={style.link} href="/sitemap.xml">
					Sitemap
				</Link>
			</div>
		</footer>
	);
}
