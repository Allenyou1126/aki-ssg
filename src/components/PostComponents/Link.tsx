/* eslint-disable @typescript-eslint/no-unused-vars */
import * as stylex from "@stylexjs/stylex";
import { themeTokens } from "@/styles/variables.stylex";
import NextLink, { LinkProps } from "next/link";

const styles = stylex.create({
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
	noTop: {
		marginTop: 0,
	},
	noBottom: {
		marginBottom: 0,
	},
});

export function Link(
	props: Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> &
		LinkProps & {
			children?: React.ReactNode | undefined;
		} & React.RefAttributes<HTMLAnchorElement> &
		StyleProps
) {
	const {
		children,
		style,
		className,
		parent,
		first,
		last,
		noTop,
		noBottom,
		...rest
	} = props;
	return (
		<NextLink
			referrerPolicy="no-referrer"
			{...stylex.props(
				styles.link,
				noTop && styles.noTop,
				noBottom && styles.noBottom
			)}
			{...rest}>
			{children}
		</NextLink>
	);
}
