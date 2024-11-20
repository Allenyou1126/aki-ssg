import type { Config } from "tailwindcss";
import { config as siteConfig } from "./src/data/site-config";
import typography from "@tailwindcss/typography";
import hljs from "tailwind-hljs";

const config: Config = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	safelist: [
		{
			pattern: /hljs+/,
		},
	],
	theme: {
		extend: {
			backgroundImage: {
				default: `url('${siteConfig.style.header_image.default}')`,
				dark: `url('${siteConfig.style.header_image.dark}')`,
			},
			colors: {
				primary: siteConfig.style.primary_color,
			},
			fontFamily: {
				crf: ["ChillRoundF"],
			},
			height: {
				nav: "var(--nav-height)",
			},
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			typography: ({ theme }: any) => ({
				ay: {
					css: {
						"--tw-prose-links": theme("colors.primary"),
						"--tw-prose-invert-body": theme("colors.gray[200] / 80%"),
						"--tw-prose-invert-headings": theme("colors.gray[300] / 80%"),
						"--tw-prose-invert-lead": theme("colors.gray[300] / 80%"),
						"--tw-prose-invert-links": theme("colors.primary / 80%"),
						"--tw-prose-invert-bold": theme("colors.gray[300] / 80%"),
						"--tw-prose-invert-counters": theme("colors.gray[300] / 90%"),
						"--tw-prose-invert-bullets": theme("colors.gray[300] / 80%"),
						"--tw-prose-invert-hr": theme("colors.gray[300] / 80%"),
						"--tw-prose-invert-quotes": theme("colors.gray[100] / 80%"),
						"--tw-prose-invert-quote-borders": theme("colors.gray[300] / 80%"),
						"--tw-prose-invert-captions": theme("colors.gray[400] / 80%"),
						"--tw-prose-invert-code": theme("colors.gray[300] / 80%"),
						"--tw-prose-invert-pre-code": theme("colors.gray[300] / 80%"),
						"--tw-prose-invert-pre-bg": "rgb(0 0 0)",
						"--tw-prose-invert-th-borders": theme("colors.gray[300] / 80%"),
						"--tw-prose-invert-td-borders": theme("colors.gray[300] / 80%"),
					},
				},
			}),
		},
		hljs: {
			theme: "night-owl",
			custom: {
				base: {
					background: "none",
					padding: "0",
				},
			},
		},
	},
	darkMode: "class",
	plugins: [typography, hljs],
};
export default config;
