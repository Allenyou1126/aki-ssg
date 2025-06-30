import { config } from "@/data/site-config";
import Link from "next/link";
import style from "./style.module.css";

export default async function Header() {
	return (
		<header className={style.header}>
			<div className={style.wrap}>
				<div className={style.meta}>
					<h1 className={style.title}>
						<Link href="/">{config.blog.title}</Link>
					</h1>
					<p className={style.description}>{config.blog.description}</p>
				</div>
			</div>
			<div className={style.filter}></div>
			<div className={style.gradient}></div>
		</header>
	);
}
