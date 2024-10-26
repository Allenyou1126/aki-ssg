/* eslint-disable @next/next/no-img-element */
"use client";
// import DarkModeSwitcher from "./DarkModeSwitcher";
import getAvatar from "@/utils/getAvatar";
import Link from "next/link";
import { connectString } from "@/utils/connectString";
import { useAtom, useAtomValue } from "jotai";
import { darkMode, scrollY } from "@/libs/state-management";
import { startTransition, useCallback, useState, useTransition } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faCircleHalfStroke,
	faMoon,
	faSun,
} from "@fortawesome/free-solid-svg-icons";
import "@/styles/animations.css";
import { config } from "@/data/site-config";

// import AllenyouLink from "./AllenyouLink";

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

export function DarkModeSwitcher() {
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
			className="text-2xl align-baseline w-12 h-12 darkani"
			onClick={handler}
			title={`切换深色模式状态（当前：${getDarkModeAlt(theme)}）`}>
			<FontAwesomeIcon icon={getDarkModeIcon(theme)} />
		</button>
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
	const [menuStep, setMenuStep] = useState<1 | 2 | 3>(1);
	const [, startTransistion] = useTransition();
	const toggleExpand = useCallback(() => {
		setExpanded(!expanded);
		if (!expanded) {
			setNavHeight(5 + 3.5 * (links.length + 2) + 0.25);
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
		<nav
			className="fixed top-0 w-full z-20 justify-center flex bg-none"
			style={{ "--nav-height": `${navHeight}rem` } as React.CSSProperties}>
			<div
				className={connectString([
					scroll > 500
						? "w-full top-0 rounded-none"
						: "rounded-[2.5rem] md:max-w-2xl md:w-auto w-2/3 top-4",
					"transistion-all transform ease-in-out duration-500",
					"fixed flex flex-col items-center h-nav md:h-20 overflow-y-hidden flex-shrink-0",
					"bg-white/70 dark:bg-gray-950/70 backdrop-blur-3xl",
				])}>
				<div className="h-20 py-2 pl-2 pr-4 w-full flex justify-between items-center gap-8 flex-shrink-0">
					<Link href="/">
						<img
							src={getAvatar(config.author.email, 80)}
							width={60}
							height={60}
							alt="Avatar"
							className="rounded-full"
						/>
					</Link>
					<ul className="hidden md:flex justify-center gap-8">
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
						<li>
							<Link href="https://www.travellings.cn/go.html">开往</Link>
						</li>
					</ul>
					<div className="flex gap-1">
						<DarkModeSwitcher />
						<button
							className="w-12 h-12 md:hidden flex items-center justify-center rounded-full md:-ms-3 transition-colors bg-white bg-opacity-0 active:bg-opacity-10"
							onClick={() => {
								toggleExpand();
							}}>
							<span className="block relative w-5 h-5" aria-hidden="true">
								<span
									className={`burger-bar duration-200 block w-5 h-[0.225rem] bg-black dark:bg-gray-300/80 rounded-full burger-bar-1--s${menuStep} absolute left-1/2`}></span>
								<span
									className={`burger-bar duration-200 block w-5 h-[0.225rem] bg-black dark:bg-gray-300/80 rounded-full burger-bar-2--s${menuStep} absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`}></span>
								<span
									className={`burger-bar duration-200 block w-5 h-[0.225rem] bg-black dark:bg-gray-300/80 rounded-full burger-bar-3--s${menuStep} absolute left-1/2`}></span>
							</span>
						</button>
					</div>
				</div>
				<hr
					className={connectString([
						expanded
							? "border-black/10 dark:border-white/10"
							: "border-transparent hidden",
						"md:hidden w-[calc(100%-1.5rem)] transition-all duration-500 transform ease-in-out",
					])}
				/>
				<ul
					className={connectString([
						expanded ? "" : "hidden",
						"flex flex-col justify-center w-full md:hidden mt-1",
					])}>
					<li className="contents">
						<Link
							className="h-14 leading-[3.5rem] w-full text-center align-middle block text-xl"
							href="/">
							首页
						</Link>
					</li>
					{links.map((ln) => {
						return (
							<li className="contents" key={ln.title}>
								<Link
									className="h-14 leading-[3.5rem] w-full text-center align-middle block text-xl"
									href={ln.url}>
									{ln.title}
								</Link>
							</li>
						);
					})}
					<li className="contents">
						<Link
							className="h-14 leading-[3.5rem] w-full text-center align-middle block text-xl"
							href="https://www.travellings.cn/go.html">
							开往
						</Link>
					</li>
				</ul>
			</div>
		</nav>
	);
}
