import { themeTokens } from "@/styles/variables.stylex";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import Link from "next/link";

export const styles = stylex.create({
	common: {
		fontSize: "1rem",
		lineHeight: "1.5rem",
		position: "absolute",
		top: "50%",
		transform: "translateY(-50%)",
	},
	button: {
		backgroundColor: themeTokens.primaryColor,
		borderRadius: "1.5rem",
		color: "rgba(255 255 255 1)",
		cursor: "pointer",
		opacity: {
			":hover": 0.9,
		},
		paddingBlock: "0.5rem",
		paddingInline: "1rem",
		textDecoration: "none",
		transition: "background-color 0.2s",
	},
	wrap: {
		height: "3rem",
		marginTop: "2rem",
		position: "relative",
	},
	page: {
		left: 0,
		margin: "auto",
		right: 0,
		textAlign: "center",
	},
	left: {
		left: 0,
	},
	right: {
		right: 0,
	},
	hide: {
		display: "none",
	},
});

type LinkNavigation = { type: "link"; getLink: (target: number) => string };
type ClientNavigation = {
	type: "client";
	action: (target: number) => never | void;
};
type Navigation = LinkNavigation | ClientNavigation;

type NavigationProps<T> = {
	navigation: T;
	target: number;
	stylexProp?: StyleXStyles;
	readonly children: React.ReactNode;
};

function PageSwitcherLink({
	navigation,
	target,
	stylexProp,
	children,
}: NavigationProps<LinkNavigation>) {
	return (
		<Link {...stylex.props(stylexProp)} href={navigation.getLink(target)}>
			{children}
		</Link>
	);
}

function PageSwitcherButton({
	navigation,
	target,
	stylexProp,
	children,
}: NavigationProps<ClientNavigation>) {
	return (
		<button
			{...stylex.props(stylexProp)}
			onClick={() => navigation.action(target)}>
			{children}
		</button>
	);
}

function PageSwitcherNavigation(props: NavigationProps<Navigation>) {
	const { navigation, stylexProp, ...rest } = props;
	switch (navigation.type) {
		case "link":
			return (
				<PageSwitcherLink
					stylexProp={[
						styles.common,
						styles.button as unknown as StyleXStyles,
						stylexProp,
					]}
					navigation={navigation}
					{...rest}
				/>
			);
		case "client":
			return (
				<PageSwitcherButton
					stylexProp={[
						styles.common,
						styles.button as unknown as StyleXStyles,
						stylexProp,
					]}
					navigation={navigation}
					{...rest}
				/>
			);
	}
}

export function PageSwitcher({
	total,
	current,
	navigation,
}: {
	total: number;
	current: number;
	navigation: Navigation;
}) {
	return (
		<div {...stylex.props(styles.wrap, total <= 1 && styles.hide)}>
			<p {...stylex.props(styles.page, styles.common)}>
				第{current}页，共{total}页
			</p>
			<PageSwitcherNavigation
				stylexProp={[styles.left, current <= 1 && styles.hide]}
				navigation={navigation}
				target={current - 1}>
				上一页
			</PageSwitcherNavigation>
			<PageSwitcherNavigation
				stylexProp={[styles.right, current >= total && styles.hide]}
				navigation={navigation}
				target={current + 1}>
				下一页
			</PageSwitcherNavigation>
		</div>
	);
}
