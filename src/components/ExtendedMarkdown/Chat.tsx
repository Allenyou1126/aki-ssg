/* eslint-disable @next/next/no-img-element */
"use client";

import { connectString } from "@/utils/connectString";
import { createContext, useContext } from "react";

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
			className={connectString([
				"flex gap-2 max-w-[90%]",
				sender.alignRight ? "flex-row-reverse self-end" : "flex-row self-start",
			])}>
			{sender.avatar === undefined ? (
				<span className="bg-primary block text-white rounded-full w-12 h-12 text-center align-middle leading-[3rem] text-2xl flex-shrink-0">
					{sender.name.charAt(0)}
				</span>
			) : (
				<img
					className="rounded-full w-12 h-12 flex-shrink-0"
					alt={sender.name}
					src={sender.avatar!}
				/>
			)}
			<div
				className={connectString([
					"flex flex-col gap-0.5",
					sender.alignRight ? "items-end" : "items-start",
				])}>
				<div
					className={connectString([
						"opacity-60 text-black dark:text-gray-300",
						sender.alignRight ? "text-right" : "text-left",
					])}>
					{sender.name}
				</div>
				<p
					className={connectString([
						"rounded-b-lg px-2 py-1 w-fit text-lg text-black dark:text-gray-300",
						sender.alignRight
							? "bg-primary/60 rounded-tl-lg text-right"
							: "bg-gray-300/60 rounded-tr-lg text-left",
					])}>
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
			<div className="flex flex-col gap-2 md:w-2/3 w-full mx-auto rounded-md bg-gray-300/50 dark:bg-gray-800/50 px-2 py-4 not-prose">
				{props.children}
			</div>
		</sender_context.Provider>
	);
}

export { Container, SenderItem, Item };
export type { Sender };
