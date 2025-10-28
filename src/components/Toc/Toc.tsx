"use client";

import { delay } from "@/utils/delay";
import { scrollIntoViewById } from "@/utils/scrollIntoView";
import type { Link, List, ListItem, Paragraph, Text } from "mdast";
import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import * as stylex from "@stylexjs/stylex";

const style = stylex.create({
	toc: {
		display: {
			default: "none",
			"@media (min-width: 1536px)": "block",
		},
		height: "100%",
		left: "16px",
		position: "absolute",
	},
	wrap: {
		height: "85vh",
		overflowY: "auto",
		position: "sticky",
		textWrap: "wrap",
		top: "7rem",
		width: "20rem",
	},
	placeholder: {
		height: "10rem",
	},
	item: {
		opacity: {
			":hover": 0.8,
		},
		textAlign: "left",
	},
	list: {
		fontWeight: 500,
		opacity: 0.9,
		paddingLeft: "2rem",
		width: "100%",
	},
});

function TocItem({ item }: { item: Paragraph }) {
	return (
		<button
			{...stylex.props(style.item)}
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
			<ul key={index} {...stylex.props(style.list)}>
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
			<div id="toc" {...stylex.props(style.toc)}>
				<div {...stylex.props(style.placeholder)} />
				<div {...stylex.props(style.wrap)}>{tocContent}</div>
			</div>,
			document.getElementById("main")!
		)
	) : (
		<></>
	);
}
