import { createConfig } from "../utils/createConfig";

export const config: SiteConfig = createConfig({
	author: {
		name: "秋实-Allenyou",
		email: "i@allenyou.wang",
	},
	blog: {
		hostname: "www.allenyou.wang",
		title: "秋实-Allenyou 的小窝",
		description: "稻花香里说丰年，听取蛙声一片",
		favicon: "/favicon.ico",
	},
	style: {
		primary_color: "#6db0ec",
		header_image: {
			default: "https://blog-oss.allenyou.top/image/658ad4c208349.png",
			dark: "https://blog-oss.allenyou.top/image/658ad4c208349.png",
		},
	},
	comment: {
		enabled: true,
		waline_api: "https://waline.allenyou.wang/",
	},
	gravatar_mirror: "https://blog-oss.allenyou.top/avatar/",
	follow: {
		user_id: 69221670505945088,
		feed_id: 73041701218313216,
	},
});
