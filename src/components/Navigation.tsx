/* eslint-disable @next/next/no-img-element */
"use client";
import getAvatar from "@/utils/getAvatar";
import Link from "next/link";
import { useAtom, useAtomValue } from "jotai";
import { darkMode, scrollY } from "@/libs/state-management";
import {
	createContext,
	MouseEventHandler,
	startTransition,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { config } from "@/data/site-config";
import { darkModeAnimation } from "@/utils/darkModeAnimation";
import * as stylex from "@stylexjs/stylex";
import { navigationTokens } from "@/styles/variables.stylex";

const itemStyles = stylex.create({
	icon: {
		fill: "currentColor",
		height: "1em",
		width: "1em",
	},
	switcher: {
		fontSize: "2rem",
		height: "3rem",
		width: "3rem",
	},
	item: {
		display: "contents",
	},
	link: {
		display: "inline-block",
		fontSize: "1.25rem",
		height: "3.5rem",
		lineHeight: "3.5rem",
		textAlign: "center",
		verticalAlign: "middle",
		width: "100%",
	},
	avatar: {
		borderRadius: "9999px",
	},
	divider: {
		borderColor: "rgb(from var(--text) r g b / 0.3)",
		display: {
			"@media (min-width: 768px)": "none",
		},
		width: "calc(100% - 1.5rem)",
	},
	expandedDivider: {
		borderColor: "transparent",
		display: "none",
	},
	toggle: {
		alignItems: "center",
		backgroundColor: "transparent",
		display: {
			default: "flex",
			"@media (min-width: 768px)": "none",
		},
		height: "3rem",
		justifyContent: "center",
		transition: "background-color 500ms cubic-bezier(0.4, 0, 0.2, 1)",
		width: "3rem",
	},
});

function getDarkModeAlt(mode: "auto" | "light" | "dark") {
	switch (mode) {
		case "auto":
			return "跟随系统";
		case "light":
			return "默认浅色";
		case "dark":
			return "默认深色";
	}
}

function Moon() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			{...stylex.props(itemStyles.icon)}
			viewBox="0 0 384 512">
			<path d="M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z" />
		</svg>
	);
}

function Sun() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			{...stylex.props(itemStyles.icon)}
			viewBox="0 0 512 512">
			<path d="M361.5 1.2c5 2.1 8.6 6.6 9.6 11.9L391 121l107.9 19.8c5.3 1 9.8 4.6 11.9 9.6s1.5 10.7-1.6 15.2L446.9 256l62.3 90.3c3.1 4.5 3.7 10.2 1.6 15.2s-6.6 8.6-11.9 9.6L391 391 371.1 498.9c-1 5.3-4.6 9.8-9.6 11.9s-10.7 1.5-15.2-1.6L256 446.9l-90.3 62.3c-4.5 3.1-10.2 3.7-15.2 1.6s-8.6-6.6-9.6-11.9L121 391 13.1 371.1c-5.3-1-9.8-4.6-11.9-9.6s-1.5-10.7 1.6-15.2L65.1 256 2.8 165.7c-3.1-4.5-3.7-10.2-1.6-15.2s6.6-8.6 11.9-9.6L121 121 140.9 13.1c1-5.3 4.6-9.8 9.6-11.9s10.7-1.5 15.2 1.6L256 65.1 346.3 2.8c4.5-3.1 10.2-3.7 15.2-1.6zM160 256a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zm224 0a128 128 0 1 0 -256 0 128 128 0 1 0 256 0z" />
		</svg>
	);
}

function System() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			{...stylex.props(itemStyles.icon)}
			viewBox="0 0 640 512">
			<path d="M128 32C92.7 32 64 60.7 64 96l0 256 64 0 0-256 384 0 0 256 64 0 0-256c0-35.3-28.7-64-64-64L128 32zM19.2 384C8.6 384 0 392.6 0 403.2C0 445.6 34.4 480 76.8 480l486.4 0c42.4 0 76.8-34.4 76.8-76.8c0-10.6-8.6-19.2-19.2-19.2L19.2 384z" />
		</svg>
	);
}

function DarkModeIcon({ mode }: { mode: "auto" | "light" | "dark" }) {
	switch (mode) {
		case "auto":
			return <System />;
		case "light":
			return <Sun />;
		case "dark":
			return <Moon />;
	}
}

function DarkModeSwitcher() {
	const [theme, setTheme] = useAtom(darkMode);
	const toggleDarkMode = useCallback(() => {
		startTransition(() => {
			switch (theme) {
				case "auto":
					setTheme("light");
					break;
				case "light":
					setTheme("dark");
					break;
				case "dark":
					setTheme("auto");
					break;
			}
		});
	}, [theme, setTheme]);
	const handler: MouseEventHandler<HTMLButtonElement> = useCallback(
		(e) => {
			darkModeAnimation(e.clientX, e.clientY, () => {
				toggleDarkMode();
			});
		},
		[toggleDarkMode]
	);
	return (
		<button
			{...stylex.props(itemStyles.switcher)}
			onClick={handler}
			title={`切换深色模式状态（当前：${getDarkModeAlt(theme)}）`}>
			<DarkModeIcon mode={theme} />
		</button>
	);
}

const toggleExpandContext = createContext<() => void>(() => {});

function NavigationItem({ link }: { link: { title: string; url: string } }) {
	const toggleExpand = useContext(toggleExpandContext);
	return (
		<li {...stylex.props(itemStyles.item)} key={link.url}>
			<Link
				{...stylex.props(itemStyles.link)}
				onClick={() => {
					toggleExpand();
				}}
				href={link.url}>
				{link.title}
			</Link>
		</li>
	);
}

type NavigationToken = {
	height: string;
	width: string;
};

const wrapStyles = stylex.create({
	wrapCommon: {
		alignItems: "center",
		backdropFilter: "blur(16px)",
		backgroundColor: "rgb(from var(--bg) r g b / 0.8)",
		display: "flex",
		flexDirection: "column",
		flexShrink: 0,
		overflow: "hidden",
		position: "fixed",
		transition:
			"width 300ms ease-in-out, height 500ms ease-in-out, top 300ms ease-in-out, border-radius 300ms ease-in-out",
	},
	wrap: {
		borderRadius: "2.5rem",
		height: {
			default: navigationTokens.height,
			"@media (min-width: 768px)": "5rem",
		},
		top: "1rem",
		width: {
			default: "66%",
			"@media (min-width: 768px)": navigationTokens.width,
		},
	},
	apply: (tokens: NavigationToken) => ({
		[navigationTokens.height]: tokens.height,
		[navigationTokens.width]: tokens.width,
	}),
	wrapWide: {
		borderRadius: 0,
		top: 0,
		width: "100%",
	},
	pcList: {
		display: {
			default: "none",
			"@media (min-width: 768px)": "flex",
		},
		gap: "2rem",
		justifyContent: "center",
	},
	mobileList: {
		display: {
			default: "flex",
			"@media (min-width: 768px)": "none",
		},
		flexDirection: "column",
		justifyContent: "center",
		marginTop: "0.25rem",
		width: "100%",
	},
	nav: {
		display: "flex",
		justifyContent: "center",
		position: "fixed",
		top: 0,
		width: "100%",
		zIndex: 20,
	},
	navInner: {
		alignItems: "center",
		display: "flex",
		flexShrink: 0,
		gap: "2rem",
		height: "5rem",
		justifyContent: "space-between",
		paddingBottom: "0.5rem",
		paddingLeft: "0.5rem",
		paddingRight: "1rem",
		paddingTop: "0.5rem",
		width: "100%",
	},
});

const toolsStyles = stylex.create({
	wrap: {
		display: "flex",
		gap: "0.25rem",
	},
	toggleIcon: {
		display: "block",
		height: "1.25rem",
		position: "relative",
		width: "1.25rem",
	},
	toggleBar: {
		backgroundColor: "var(--text)",
		borderRadius: "999px",
		display: "block",
		height: "0.225rem",
		left: "50%",
		position: "absolute",
		transition:
			"transform 150ms ease-in-out, height 150ms ease-in-out, top 150ms ease-in-out, bottom 150ms ease-in-out",
		width: "1.25rem",
	},
	toggleBarTop50: {
		top: "50%",
	},
	toggleBarTop0: {
		top: 0,
	},
	toggleBarBottom0: {
		bottom: 0,
	},
	toggleBarBottom50: {
		bottom: "50%",
	},
	toggleBarMiddle: {
		transform: "translateX(-50%) translateY(-50%)",
	},
	toggleBarMiddle2: {
		transform: "translateX(-50%) translateY(50%)",
	},
	toggleBarStart: {
		transform: "translateX(-50%)",
	},
	toggleBarHidden: {
		display: "none",
	},
	toggleBarBold: {
		height: "0.2rem",
	},
	toggleBarEnd1: {
		transform: "translateX(-50%) translateY(-50%) rotate(45deg) scale(1.3)",
	},
	toggleBarEnd2: {
		transform: "translateX(-50%) translateY(50%) rotate(-45deg) scale(1.3)",
	},
});

export default function Navigation({
	links,
}: {
	links: { title: string; url: string }[];
}) {
	const scroll = useAtomValue(scrollY);
	const [expanded, setExpanded] = useState(false);
	const [navHeight, setNavHeight] = useState(5);
	const [navWidth, setNavWidth] = useState(Math.max(10, 5 * links.length + 10));
	const [menuStep, setMenuStep] = useState<1 | 2 | 3>(1);
	useEffect(() => {
		setNavWidth(Math.max(10, 5 * links.length + 10));
	}, [links]);
	const toggleExpand = useCallback(() => {
		setExpanded(!expanded);
		if (!expanded) {
			setNavHeight(5 + 3.5 * links.length + 0.25);
			startTransition(() => {
				setMenuStep(2);
			});
			setTimeout(() => {
				startTransition(() => {
					setMenuStep(3);
				});
			}, 200);
		} else {
			setNavHeight(5);
			startTransition(() => {
				setMenuStep(2);
			});
			setTimeout(() => {
				startTransition(() => {
					setMenuStep(1);
				});
			}, 200);
		}
	}, [setExpanded, setNavHeight, expanded, links]);
	return (
		<toggleExpandContext.Provider
			value={() => {
				toggleExpand();
			}}>
			<nav
				{...stylex.props(
					wrapStyles.nav,
					wrapStyles.apply({
						height: `${navHeight}rem`,
						width: `${navWidth}rem`,
					})
				)}>
				<div
					{...stylex.props(
						wrapStyles.wrapCommon,
						scroll > 500 ? wrapStyles.wrapWide : wrapStyles.wrap
					)}>
					<div {...stylex.props(wrapStyles.navInner)}>
						<Link href="/">
							<img
								src={getAvatar(config.author.email, 80)}
								width={60}
								height={60}
								alt="Avatar"
								{...stylex.props(itemStyles.avatar)}
							/>
						</Link>
						<ul {...stylex.props(wrapStyles.pcList)}>
							{links.map((ln) => {
								return (
									<li key={ln.url}>
										<Link href={ln.url}>{ln.title}</Link>
									</li>
								);
							})}
						</ul>
						<div {...stylex.props(toolsStyles.wrap)}>
							<DarkModeSwitcher />
							<button
								{...stylex.props(itemStyles.toggle)}
								onClick={() => {
									toggleExpand();
								}}>
								<span
									{...stylex.props(toolsStyles.toggleIcon)}
									aria-hidden="true">
									<span
										{...stylex.props(
											toolsStyles.toggleBar,
											menuStep === 1
												? toolsStyles.toggleBarTop0
												: toolsStyles.toggleBarTop50,
											menuStep === 3 && toolsStyles.toggleBarBold,
											menuStep === 2 && toolsStyles.toggleBarMiddle,
											menuStep === 1 && toolsStyles.toggleBarStart,
											menuStep === 3 && toolsStyles.toggleBarEnd1
										)}
									/>
									<span
										{...stylex.props(
											toolsStyles.toggleBar,
											toolsStyles.toggleBarTop50,
											toolsStyles.toggleBarMiddle,
											menuStep === 3 && toolsStyles.toggleBarHidden
										)}
									/>
									<span
										{...stylex.props(
											toolsStyles.toggleBar,
											menuStep === 1
												? toolsStyles.toggleBarBottom0
												: toolsStyles.toggleBarBottom50,
											menuStep === 3 && toolsStyles.toggleBarBold,
											menuStep === 2 && toolsStyles.toggleBarMiddle2,
											menuStep === 1 && toolsStyles.toggleBarStart,
											menuStep === 3 && toolsStyles.toggleBarEnd2
										)}
									/>
								</span>
							</button>
						</div>
					</div>
					<hr
						{...stylex.props(
							itemStyles.divider,
							!expanded && itemStyles.expandedDivider
						)}
					/>
					<ul
						{...stylex.props(
							wrapStyles.mobileList,
							!expanded && itemStyles.expandedDivider
						)}>
						{links.map((ln) => {
							return <NavigationItem link={ln} key={ln.url} />;
						})}
					</ul>
				</div>
			</nav>
		</toggleExpandContext.Provider>
	);
}
