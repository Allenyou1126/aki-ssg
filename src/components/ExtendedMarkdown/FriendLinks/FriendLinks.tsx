/* eslint-disable @next/next/no-img-element */

import { initCMS } from "@/libs/content-management";
import getAvatar from "@/utils/getAvatar";
import Link from "next/link";
import * as stylex from "@stylexjs/stylex";
import { themeTokens } from "@/styles/variables.stylex";

const style = stylex.create({
	grid: {
		display: "grid",
		gap: "1rem",
		gridTemplateColumns: {
			default: "repeat(1, minmax(0, 1fr))",
			"@media (min-width: 768px)": "repeat(2, minmax(0, 1fr))",
		},
	},
	item: {
		alignItems: "center",
		display: "flex",
		flexWrap: "nowrap",
		gap: "1rem",
		gridColumn: "span 1 / span 1",
		opacity: {
			":hover": 0.9,
		},
	},
	avatar: {
		borderRadius: "9999px",
		height: "80px",
		objectFit: "cover",
		width: "80px",
	},
	title: {
		color: themeTokens.primaryColor,
		fontSize: "1.25rem",
		fontWeight: 600,
		lineHeight: "1.75rem",
	},
	description: {
		gridRow: "span 2 / span 2",
		opacity: 0.6,
	},
	metadata: {
		display: "grid",
		gridTemplateRows: "repeat(3, minmax(0, 1fr))",
		paddingBlock: "1.5rem",
		paddingInline: "0",
	},
});

function FriendLinkItem({ link }: { link: FriendLink }) {
	return (
		<Link href={link.url} {...stylex.props(style.item)}>
			<img
				alt={`avatar-${link.title}`}
				src={link.avatar}
				{...stylex.props(style.avatar)}
				width={80}
				height={80}
			/>
			<div {...stylex.props(style.metadata)}>
				<p {...stylex.props(style.title)}>{link.title}</p>
				<p {...stylex.props(style.description)}>{link.description}</p>
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
	// TODO: Add not-prose classname
	return <div {...stylex.props(style.grid)}>{linkList}</div>;
}
