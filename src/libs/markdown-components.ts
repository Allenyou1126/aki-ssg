import { Code, Kbd, Pre } from "@/components/PostComponents/Code";
import { Hr } from "@/components/PostComponents/Hr";
import { OList, UList, ListItem } from "@/components/PostComponents/List";
import { Paragraph } from "@/components/PostComponents/Paragraph";
import {
	Table,
	TBody,
	Td,
	TFoot,
	Th,
	THead,
	Tr,
} from "@/components/PostComponents/Table";
import { Components } from "hast-util-to-jsx-runtime";
import Link from "next/link";

export const html_components = {
	a: Link,
	ol: OList,
	ul: UList,
	li: ListItem,
	hr: Hr,
	tr: Tr,
	td: Td,
	th: Th,
	table: Table,
	thead: THead,
	tbody: TBody,
	tfoot: TFoot,
	p: Paragraph,
	pre: Pre,
	code: Code,
	kbd: Kbd,
} satisfies Partial<Components>;
