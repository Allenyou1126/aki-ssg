import * as stylex from "@stylexjs/stylex";
import { themeTokens } from "@/styles/variables.stylex";
import NextLink, { LinkProps } from "next/link";

const style = stylex.create({
	link: {
		color: {
			default: themeTokens.primaryColor,
			":hover": `hsl(from ${themeTokens.primaryColor} h s calc(l * 0.9) / alpha)`,
		},
		textDecorationColor: {
			default: "transparent",
			":hover": themeTokens.primaryColor,
		},
		textDecorationLine: "underline",
		transition:
			"text-decoration-color 0.3s ease-in-out, color 0.3s ease-in-out",
	},
});

export function Link(
	props: Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> &
		LinkProps & {
			children?: React.ReactNode | undefined;
		} & React.RefAttributes<HTMLAnchorElement>
) {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { children, style: _style, className: _className, ...rest } = props;
	return (
		<NextLink
			referrerPolicy="no-referrer"
			{...stylex.props(style.link)}
			{...rest}>
			{children}
		</NextLink>
	);
}
