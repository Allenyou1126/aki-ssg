import * as stylex from "@stylexjs/stylex";
import { HTMLAttributes } from "react";

const hljsStyles = stylex.create({
	comment: {
		color: "#5c6370",
		fontStyle: "italic",
	},
	quote: {
		color: "#5c6370",
		fontStyle: "italic",
	},
	doctag: {
		color: "#c678dd",
	},
	keyword: {
		color: "#c678dd",
	},
	formula: {
		color: "#c678dd",
	},
	section: {
		color: "#e06c75",
	},
	name: {
		color: "#e06c75",
	},
	selectorTag: {
		color: "#e06c75",
	},
	deletion: {
		color: "#e06c75",
	},
	subst: {
		color: "#e06c75",
	},
	literal: {
		color: "#56b6c2",
	},
	string: {
		color: "#98c379",
	},
	regexp: {
		color: "#98c379",
	},
	addition: {
		color: "#98c379",
	},
	attribute: {
		color: "#98c379",
	},
	metaString: {
		color: "#98c379",
	},
	attr: {
		color: "#d19a66",
	},
	variable: {
		color: "#d19a66",
	},
	templateVariable: {
		color: "#d19a66",
	},
	type: {
		color: "#d19a66",
	},
	selectorClass: {
		color: "#d19a66",
	},
	selectorAttr: {
		color: "#d19a66",
	},
	selectorPseudo: {
		color: "#d19a66",
	},
	number: {
		color: "#d19a66",
	},
	symbol: {
		color: "#61aeee",
	},
	bullet: {
		color: "#61aeee",
	},
	link: {
		color: "#61aeee",
		textDecoration: "underline",
	},
	meta: {
		color: "#61aeee",
	},
	selectorId: {
		color: "#61aeee",
	},
	title: {
		color: "#61aeee",
	},
	builtIn: {
		color: "#e6c07b",
	},
	titleClass: {
		color: "#e6c07b",
	},
	emphasis: {
		fontStyle: "italic",
	},
	strong: {
		fontWeight: 700,
	},
});

export function CodeSpan(
	props: HTMLAttributes<HTMLSpanElement> & { tags?: string[] | string }
) {
	const { tags, ...rest } = props;
	const tagList =
		tags === undefined ? [] : Array.isArray(tags) ? tags : tags.split(" ");
	const appliedStyles = {
		comment: false,
		quote: false,
		doctag: false,
		keyword: false,
		formula: false,
		section: false,
		name: false,
		selectorTag: false,
		deletion: false,
		subst: false,
		literal: false,
		string: false,
		regexp: false,
		addition: false,
		attribute: false,
		attr: false,
		variable: false,
		templateVariable: false,
		type: false,
		selectorClass: false,
		selectorAttr: false,
		selectorPseudo: false,
		number: false,
		symbol: false,
		bullet: false,
		link: false,
		meta: false,
		selectorId: false,
		title: false,
		builtIn: false,
		class: false,
		emphasis: false,
		strong: false,
	};
	tagList.forEach((tag) => {
		switch (tag) {
			case "comment":
				appliedStyles.comment = true;
				break;
			case "quote":
				appliedStyles.quote = true;
				break;
			case "doctag":
				appliedStyles.doctag = true;
				break;
			case "keyword":
				appliedStyles.keyword = true;
				break;
			case "formula":
				appliedStyles.formula = true;
				break;
			case "section":
				appliedStyles.section = true;
				break;
			case "name":
				appliedStyles.name = true;
				break;
			case "selector-tag":
				appliedStyles.selectorTag = true;
				break;
			case "deletion":
				appliedStyles.deletion = true;
				break;
			case "subst":
				appliedStyles.subst = true;
				break;
			case "literal":
				appliedStyles.literal = true;
				break;
			case "string":
				appliedStyles.string = true;
				break;
			case "regexp":
				appliedStyles.regexp = true;
				break;
			case "addition":
				appliedStyles.addition = true;
				break;
			case "attribute":
				appliedStyles.attribute = true;
				break;
			case "attr":
				appliedStyles.attr = true;
				break;
			case "variable":
				appliedStyles.variable = true;
				break;
			case "template-variable":
				appliedStyles.templateVariable = true;
				break;
			case "type":
				appliedStyles.type = true;
				break;
			case "selector-class":
				appliedStyles.selectorClass = true;
				break;
			case "selector-attr":
				appliedStyles.selectorAttr = true;
				break;
			case "selector-pseudo":
				appliedStyles.selectorPseudo = true;
				break;
			case "number":
				appliedStyles.number = true;
				break;
			case "symbol":
				appliedStyles.symbol = true;
				break;
			case "bullet":
				appliedStyles.bullet = true;
				break;
			case "link":
				appliedStyles.link = true;
				break;
			case "meta":
				appliedStyles.meta = true;
				break;
			case "selector-id":
				appliedStyles.selectorId = true;
				break;
			case "title":
				appliedStyles.title = true;
				break;
			case "built_in":
				appliedStyles.builtIn = true;
				break;
			case "emphasis":
				appliedStyles.emphasis = true;
				break;
			case "strong":
				appliedStyles.strong = true;
				break;
		}
	});
	return (
		<span
			{...stylex.props(
				appliedStyles.comment && hljsStyles.comment,
				appliedStyles.quote && hljsStyles.quote,
				appliedStyles.doctag && hljsStyles.doctag,
				appliedStyles.keyword && hljsStyles.keyword,
				appliedStyles.formula && hljsStyles.formula,
				appliedStyles.section && hljsStyles.section,
				appliedStyles.name && hljsStyles.name,
				appliedStyles.selectorTag && hljsStyles.selectorTag,
				appliedStyles.deletion && hljsStyles.deletion,
				appliedStyles.subst && hljsStyles.subst,
				appliedStyles.literal && hljsStyles.literal,
				appliedStyles.string && hljsStyles.string,
				appliedStyles.regexp && hljsStyles.regexp,
				appliedStyles.addition && hljsStyles.addition,
				appliedStyles.attribute && hljsStyles.attribute,
				appliedStyles.attr && hljsStyles.attr,
				appliedStyles.variable && hljsStyles.variable,
				appliedStyles.templateVariable && hljsStyles.templateVariable,
				appliedStyles.type && hljsStyles.type,
				appliedStyles.selectorClass && hljsStyles.selectorClass,
				appliedStyles.selectorAttr && hljsStyles.selectorAttr,
				appliedStyles.selectorPseudo && hljsStyles.selectorPseudo,
				appliedStyles.number && hljsStyles.number,
				appliedStyles.symbol && hljsStyles.symbol,
				appliedStyles.bullet && hljsStyles.bullet,
				appliedStyles.link && hljsStyles.link,
				appliedStyles.meta && hljsStyles.meta,
				appliedStyles.selectorId && hljsStyles.selectorId,
				appliedStyles.title && hljsStyles.title,
				appliedStyles.builtIn && hljsStyles.builtIn,
				appliedStyles.emphasis && hljsStyles.emphasis,
				appliedStyles.strong && hljsStyles.strong,
				appliedStyles.title && appliedStyles.class && hljsStyles.titleClass,
				appliedStyles.meta && appliedStyles.string && hljsStyles.metaString
			)}
			{...rest}
		/>
	);
}
