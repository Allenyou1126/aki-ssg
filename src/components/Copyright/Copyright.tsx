import { config } from "@/data/site-config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreativeCommons } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";
import style from "./style.module.css";

export default async function Copyright({
	title,
	id,
	cc,
}: {
	title: string;
	id: number;
	cc?: string;
}) {
	cc = cc ?? "CC BY-NC-SA 4.0";
	return (
		<div className={style.wrap}>
			<p className={style.title}>{title}</p>
			<Link
				className={style.link}
				href={`https://${config.blog.hostname}/post/${id}`}>{`https://${config.blog.hostname}/post/${id}`}</Link>
			<div className={style.grid}>
				<div>
					<p className={style.gridTitle}>本文作者</p>
					<p className={style.gridContent}>{config.author.name}</p>
				</div>
				<div>
					<p className={style.gridTitle}>授权协议</p>
					<p className={style.gridContent}>{cc}</p>
				</div>
			</div>
			<FontAwesomeIcon className={style.icon} icon={faCreativeCommons} />
		</div>
	);
}
