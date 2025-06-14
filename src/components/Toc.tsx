"use client";

import type { Link, List, ListItem, Text } from "mdast";
import type { ReactNode } from "react";

function rendToc(toc: List | ListItem, index: number = 0): ReactNode {
	if (toc.type === "list") {
		return (
			<ul key={index} className="pl-8 w-full opacity-90 font-medium">
				{toc.children.map((it, index) => {
					return rendToc(it, index);
				})}
			</ul>
		);
	}
	if (toc.children.length === 0) {
		return [];
	}
	const listItems = toc.children
		.map((item, ind) => {
			if (item.type === "paragraph") {
				return (
					<button
						key={ind}
						className="hover:opacity-80 text-left"
						onClick={() => {
							setTimeout(() => {
								document
									.getElementById(
										`user-content-${(item.children[0] as Link).url.substring(
											1
										)}`
									)!
									.scrollIntoView({ block: "center" });
							}, 10);
						}}>
						{((item.children[0] as Link).children[0] as Text).value}
					</button>
				);
			}
			if (item.type !== "list") {
				return undefined;
			}
			return rendToc(item, ind);
		})
		.filter((item) => item !== undefined) as ReactNode[];
	return <li key={index}>{listItems}</li>;
}

export default function Toc({ toc }: { toc: List }) {
	if (toc === undefined) {
		return <></>;
	}
	const tocContent: ReactNode = rendToc(toc);
	return (
		<div className="hidden 2xl:block absolute left-4 h-full">
			<div className="h-40"></div>
			<div className="sticky top-28 w-80 overflow-y-auto text-wrap h-[85vh]">
				{tocContent}
			</div>
		</div>
	);
}
