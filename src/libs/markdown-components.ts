import { Blockquote } from "@/components/PostComponents/Blockquote";
import { Code, Kbd, Pre } from "@/components/PostComponents/Code";
import { H1, H2, H3, H4, H5, H6 } from "@/components/PostComponents/Header";
import { Hr } from "@/components/PostComponents/Hr";
import { Link } from "@/components/PostComponents/Link";
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
	blockquote: Blockquote,
	h1: H1,
	h2: H2,
	h3: H3,
	h4: H4,
	h5: H5,
	h6: H6,
} satisfies Partial<Components>;
