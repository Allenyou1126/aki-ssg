import { OList, UList, ListItem } from "@/components/PostComponents/List";
import { Components } from "hast-util-to-jsx-runtime";
import Link from "next/link";

export const html_components = {
	a: Link,
	ol: OList,
	ul: UList,
	li: ListItem,
} satisfies Partial<Components>;
