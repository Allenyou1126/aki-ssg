import BilibiliVideo from "@/components/ExtendedMarkdown/BilibiliVideo/BilibiliVideo";
import FriendLinks from "@/components/ExtendedMarkdown/FriendLinks";
import Meme from "@/components/ExtendedMarkdown/Meme";
import * as Chat from "@/components/ExtendedMarkdown/Chat";

import { Components } from "hast-util-to-jsx-runtime";

export const extended_components = {
	bilibili: BilibiliVideo,
	"friend-links": FriendLinks,
	chat: Chat.Container,
	"chat-item": Chat.Item,
	"chat-sender": Chat.SenderItem,
	meme: Meme,
} satisfies Partial<Components>;
