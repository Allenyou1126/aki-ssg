/* eslint-disable @next/next/no-img-element */
"use client";
import getAvatar from "@/utils/getAvatar";
import Link from "next/link";
import { useAtom, useAtomValue } from "jotai";
import { darkMode, scrollY } from "@/libs/state-management";
import {
	createContext,
	startTransition,
	useCallback,
	useContext,
	useEffect,
	useState,
	useTransition,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faCircleHalfStroke,
	faMoon,
	faSun,
} from "@fortawesome/free-solid-svg-icons";
import { config } from "@/data/site-config";
import style from "./style.module.css";

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

function getDarkModeIcon(mode: "auto" | "light" | "dark") {
	switch (mode) {
		case "auto":
			return faCircleHalfStroke;
		case "light":
			return faSun;
		case "dark":
			return faMoon;
	}
}

function DarkModeSwitcher() {
	const [theme, setTheme] = useAtom(darkMode);
	const handler = useCallback(() => {
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
	return (
		<button
			className={style.switcher}
			onClick={handler}
			title={`切换深色模式状态（当前：${getDarkModeAlt(theme)}）`}>
			<FontAwesomeIcon icon={getDarkModeIcon(theme)} />
		</button>
	);
}

const toggleExpandContext = createContext<() => void>(() => {});

function NavigationItem({ link }: { link: { title: string; url: string } }) {
	const toggleExpand = useContext(toggleExpandContext);
	return (
		<li className={style.item} key={link.title}>
			<Link
				className={style.link}
				onClick={() => {
					toggleExpand();
				}}
				href={link.url}>
				{link.title}
			</Link>
		</li>
	);
}

export default function Navigation({
	links,
}: {
	links: { title: string; url: string }[];
}) {
	const scroll = useAtomValue(scrollY);
	const [expanded, setExpanded] = useState(false);
	const [navHeight, setNavHeight] = useState(5);
	const [navWidth, setNavWidth] = useState(5);
	const [menuStep, setMenuStep] = useState<1 | 2 | 3>(1);
	const [, startTransistion] = useTransition();
	useEffect(() => {
		setNavWidth(Math.min(42, 5 * (links.length + 1) + 10));
	}, [links]);
	const toggleExpand = useCallback(() => {
		setExpanded(!expanded);
		if (!expanded) {
			setNavHeight(5 + 3.5 * (links.length + 1) + 0.25);
			startTransistion(() => {
				setMenuStep(2);
			});
			setTimeout(() => {
				startTransistion(() => {
					setMenuStep(3);
				});
			}, 200);
		} else {
			setNavHeight(5);
			startTransistion(() => {
				setMenuStep(2);
			});
			setTimeout(() => {
				startTransistion(() => {
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
				className={style.nav}
				style={
					{
						"--nav-height": `${navHeight}rem`,
						"--nav-width": `${navWidth}rem`,
					} as React.CSSProperties
				}>
				<div className={scroll > 500 ? style.wrapWide : style.wrap}>
					<div className={style.bar}>
						<Link href="/">
							<img
								src={getAvatar(config.author.email, 80)}
								width={60}
								height={60}
								alt="Avatar"
								style={{ borderRadius: "9999px" }}
							/>
						</Link>
						<ul className={style.pc}>
							<li>
								<Link href="/">首页</Link>
							</li>
							{links.map((ln) => {
								return (
									<li key={ln.title}>
										<Link href={ln.url}>{ln.title}</Link>
									</li>
								);
							})}
						</ul>
						<div className={style.tools}>
							<DarkModeSwitcher />
							<button
								className={style.toggle}
								onClick={() => {
									toggleExpand();
								}}>
								<span className={style.icon} aria-hidden="true">
									<span
										className={[
											style.toggleBar,
											style.toggleBar1,
											style[`step${menuStep}`],
										].join(" ")}
									/>
									<span
										className={[
											style.toggleBar,
											style.toggleBar2,
											style[`step${menuStep}`],
										].join(" ")}
									/>
									<span
										className={[
											style.toggleBar,
											style.toggleBar3,
											style[`step${menuStep}`],
										].join(" ")}
									/>
								</span>
							</button>
						</div>
					</div>
					<hr
						className={style.divider}
						style={{
							display: expanded ? undefined : "none",
							borderColor: expanded ? undefined : "transparent",
						}}
					/>
					<ul
						className={style.mobile}
						style={{ display: expanded ? undefined : "none" }}>
						<NavigationItem link={{ title: "首页", url: "/" }} />
						{links.map((ln) => {
							return <NavigationItem link={ln} key={ln.title} />;
						})}
					</ul>
				</div>
			</nav>
		</toggleExpandContext.Provider>
	);
}
