/* eslint-disable @next/next/no-img-element */
"use client";

import { createContext, useContext } from "react";
import * as stylex from "@stylexjs/stylex";
import { themeTokens } from "@/styles/variables.stylex";

type Sender = {
	name: string;
	avatar?: string;
	alignRight?: boolean;
};

const default_sender: Sender = {
	name: "Unknown",
};

class SenderManager {
	senders: { [key: string]: Sender } = {};
	initialized: boolean;
	constructor(initialized: boolean = false) {
		this.initialized = initialized;
	}
	getSenderByName(name: string): Sender | undefined {
		return this.senders[name];
	}
	addSender(s: Sender) {
		this.senders[s.name] = s;
	}
}

const sender_context = createContext<SenderManager>(new SenderManager());

const itemStyle = stylex.create({
	sender: {
		color: "var(--text)",
		opacity: 0.6,
		textAlign: "left",
	},
	senderSelf: {
		textAlign: "right",
	},
	content: {
		alignItems: "start",
		display: "flex",
		flexDirection: "column",
		gap: "0.125rem",
	},
	contentSelf: {
		alignItems: "end",
	},
	text: {
		backgroundColor: "rgb(209 213 219 / 0.6)",
		borderBottomLeftRadius: "0.5rem",
		borderBottomRightRadius: "0.5rem",
		borderTopRightRadius: "0.5rem",
		color: "var(--text)",
		fontSize: "1.125rem",
		lineHeight: "1.75rem",
		paddingBlock: "0.25rem",
		paddingInline: "0.5rem",
		textAlign: "left",
		width: "fit-content",
	},
	textSelf: {
		backgroundColor: `rgb(from ${themeTokens.primaryColor} r g b / 0.6)`,
		borderTopLeftRadius: "0.5rem",
		borderTopRightRadius: 0,
		textAlign: "right",
	},
	item: {
		alignItems: "flex-start",
		display: "flex",
		flexDirection: "row",
		gap: "0.5rem",
		maxWidth: "90%",
	},
	itemSelf: {
		alignSelf: "flex-end",
		flexDirection: "row-reverse",
	},
	avatar: {
		borderRadius: "9999px",
		flexShrink: 0,
		height: "3rem",
		width: "3rem",
	},
	avatarDefault: {
		backgroundColor: themeTokens.primaryColor,
		color: "white",
		display: "inline-block",
		fontSize: "1.5rem",
		lineHeight: "3rem",
		textAlign: "center",
		verticalAlign: "middle",
	},
	container: {
		backgroundColor: "var(--copyright-bg)",
		borderRadius: "0.375rem",
		display: "flex",
		flexDirection: "column",
		gap: "0.5rem",
		marginBlock: "0",
		marginInline: "auto",
		paddingBlock: "1rem",
		paddingInline: "0.5rem",
		width: {
			default: "100%",
			"@media (min-width: 768px)": "66%",
		},
	},
});

function Item(props: {
	sender_name?: string;
	sender_avatar?: string;
	align_right?: boolean;
	readonly children?: string;
}) {
	const senderManager = useContext(sender_context);
	if (!senderManager.initialized) {
		throw Error("Conversation Item cannot be used outside Conversation!");
	}
	const sender: Sender =
		props.sender_name === undefined
			? default_sender
			: senderManager.getSenderByName(props.sender_name) === undefined
			? {
					name: props.sender_name,
					avatar: props.sender_avatar,
					alignRight: props.align_right,
			  }
			: senderManager.getSenderByName(props.sender_name)!;
	return (
		<div
			{...stylex.props(
				itemStyle.item,
				sender.alignRight && itemStyle.itemSelf
			)}>
			{sender.avatar === undefined ? (
				<span {...stylex.props(itemStyle.avatar, itemStyle.avatarDefault)}>
					{sender.name.charAt(0)}
				</span>
			) : (
				<img
					{...stylex.props(itemStyle.avatar)}
					alt={sender.name}
					src={sender.avatar!}
				/>
			)}
			<div
				{...stylex.props(
					itemStyle.content,
					sender.alignRight && itemStyle.contentSelf
				)}>
				<div
					{...stylex.props(
						itemStyle.sender,
						sender.alignRight && itemStyle.senderSelf
					)}>
					{sender.name}
				</div>
				<p
					{...stylex.props(
						itemStyle.text,
						sender.alignRight && itemStyle.textSelf
					)}>
					{props.children}
				</p>
			</div>
		</div>
	);
}

function SenderItem(props: {
	sender_name: string;
	sender_avatar?: string;
	align_right?: boolean;
}) {
	const sender: Sender = {
		name: props.sender_name,
		avatar: props.sender_avatar,
		alignRight: props.align_right,
	};
	const senderManager = useContext(sender_context);
	if (!senderManager.initialized) {
		throw Error("Conversation Sender cannot be used outside Conversation!");
	}
	senderManager.addSender(sender);
	return <></>;
}

function Container(props: { readonly children?: React.ReactNode }) {
	return (
		<sender_context.Provider value={new SenderManager(true)}>
			<div {...stylex.props(itemStyle.container)}>{props.children}</div>
		</sender_context.Provider>
	);
}

export { Container, SenderItem, Item };
export type { Sender };
