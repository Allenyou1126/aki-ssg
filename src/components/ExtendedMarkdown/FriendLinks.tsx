/* eslint-disable @next/next/no-img-element */

import { initCMS } from "@/libs/content-management";
import getAvatar from "@/utils/getAvatar";
import Link from "next/link";

export default async function FriendLinks() {
	const cms = await initCMS();
	const linkList = cms.getFriendLinks().map((link, index) => {
		if (link.avatar == undefined) {
			link.avatar = getAvatar();
		}
		if (link.description == undefined) {
			link.description = "";
		}
		return (
			<Link
				key={index}
				href={link.url}
				className="flex flex-nowrap items-center gap-4 hover:opacity-90 col-span-1">
				<img
					alt={`avatar-${link.title}`}
					src={link.avatar}
					className="rounded-full"
					width={80}
					height={80}
				/>
				<div className="grid grid-rows-3 py-6">
					<p className="font-semibold text-primary text-xl">{link.title}</p>
					<p className="opacity-60 row-span-2">{link.description}</p>
				</div>
			</Link>
		);
	});
	return (
		<div className="gap-4 grid grid-cols-1 md:grid-cols-2 not-prose">
			{linkList}
		</div>
	);
}
