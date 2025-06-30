/* eslint-disable @next/next/no-img-element */

import { initCMS } from "@/libs/content-management";
import getAvatar from "@/utils/getAvatar";
import Link from "next/link";
import style from "./style.module.css";

function FriendLinkItem({ link }: { link: FriendLink }) {
	return (
		<Link href={link.url} className={style.item}>
			<img
				alt={`avatar-${link.title}`}
				src={link.avatar}
				className={style.avatar}
				width={80}
				height={80}
			/>
			<div className={style.metadata}>
				<p className={style.title}>{link.title}</p>
				<p className={style.description}>{link.description}</p>
			</div>
		</Link>
	);
}

export default async function FriendLinks() {
	const cms = await initCMS();
	const linkList = cms.getFriendLinks().map((link, index) => {
		link.avatar = link.avatar ?? getAvatar();
		link.description = link.description ?? "";
		return <FriendLinkItem link={link} key={index} />;
	});
	return <div className={[style.grid, "not-prose"].join(" ")}>{linkList}</div>;
}
