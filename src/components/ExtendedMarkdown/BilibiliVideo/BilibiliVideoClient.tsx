"use client";
import * as stylex from "@stylexjs/stylex";

const style = stylex.create({
	video: {
		borderWidth: 0,
		height: "500px",
		maxWidth: "100%",
		overflow: "hidden",
		width: "100%",
	},
});

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
			{...stylex.props(style.video)}
			sandbox="allow-top-navigation allow-same-origin allow-forms allow-scripts"></iframe>
	);
}
