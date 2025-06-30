"use client";
import style from "./style.module.css";

export default function BilibiliVideoClient({
	bvid,
	avid,
	cid,
}: {
	bvid: string;
	avid: string;
	cid?: string;
}) {
	return (
		<iframe
			src={`//player.bilibili.com/player.html?aid=${avid}&bvid=BV${bvid}${
				cid == undefined ? "" : `&cid=${cid}`
			}&page=1&high_quality=1&danmaku=0`}
			allowFullScreen={true}
			className={style.video}
			sandbox="allow-top-navigation allow-same-origin allow-forms allow-scripts"></iframe>
	);
}
