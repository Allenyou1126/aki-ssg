"use client";

import { delay } from "@/utils/delay";
import { scrollIntoViewById } from "@/utils/scrollIntoView";
import type { Link, List, ListItem, Paragraph, Text } from "mdast";
import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import style from "./style.module.css";

function TocItem({ item }: { item: Paragraph }) {
	return (
		<button
			className={style.item}
			onClick={() => {
				delay(10).then(() => {
					scrollIntoViewById(
						`user-content-${(item.children[0] as Link).url.substring(1)}`
					);
				});
			}}>
			{((item.children[0] as Link).children[0] as Text).value}
		</button>
	);
}

function rendToc(toc: List | ListItem, index: number = 0): ReactNode {
	if (toc.type === "list") {
		return (
			<ul key={index} className={style.list}>
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
				return <TocItem item={item} key={ind} />;
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
	const [mounted, setMounted] = useState(false);
	useEffect(() => {
		if (!mounted) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setMounted(true);
		}
	}, [mounted]);
	if (toc === undefined) {
		return <></>;
	}
	const tocContent: ReactNode = rendToc(toc);
	return mounted ? (
		createPortal(
			<div id="toc" className={style.toc}>
				<div style={{ height: "10rem" }} />
				<div className={style.wrap}>{tocContent}</div>
			</div>,
			document.getElementById("main")!
		)
	) : (
		<></>
	);
}
