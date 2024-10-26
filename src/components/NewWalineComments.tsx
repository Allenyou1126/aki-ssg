/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client";

import { config } from "@/data/site-config";
import "@/styles/newwaline.css";
import {
	createContext,
	DispatchWithoutAction,
	Suspense,
	useCallback,
	useContext,
	useReducer,
	useState,
} from "react";
import { usePathname } from "next/navigation";
import {
	addComment,
	WalineRootComment,
	WalineChildComment,
	getComment,
	WalineComment,
} from "@waline/api";
import { connectString } from "@/utils/connectString";
import getAvatar from "@/utils/getAvatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentAlt } from "@fortawesome/free-regular-svg-icons";
// import htmr from "htmr";
// import AllenyouLink from "./AllenyouLink";
// import LazyloadImage from "./LazyloadImage";
import { faReply } from "@fortawesome/free-solid-svg-icons";
import { CommentsLoading } from "./Comments";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { fromHtml } from "hast-util-from-html";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import useSWR from "swr";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";

const api_option = {
	serverURL: (config.comment as WalineCommentConfig).waline_api,
	lang: "zh",
};

const pidContext = createContext("");
const ridContext = createContext("");
const atContext = createContext("");
const setPidContext = createContext((v: string) => {});
const setRidContext = createContext((v: string) => {});
const setAtContext = createContext((v: string) => {});

export function NewWalineCommentsDataProvider({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const [pid, setPid] = useState("");
	const [rid, setRid] = useState("");
	const [at, setAt] = useState("");
	return (
		<pidContext.Provider value={pid}>
			<ridContext.Provider value={rid}>
				<atContext.Provider value={at}>
					<setRidContext.Provider
						value={(v: string) => {
							setRid(v);
						}}>
						<setPidContext.Provider
							value={(v: string) => {
								setPid(v);
							}}>
							<setAtContext.Provider
								value={(v: string) => {
									setAt(v);
								}}>
								{children}
							</setAtContext.Provider>
						</setPidContext.Provider>
					</setRidContext.Provider>
				</atContext.Provider>
			</ridContext.Provider>
		</pidContext.Provider>
	);
}

export const NewWalineErrorHandler = (props: FallbackProps) => {
	console.log(props.error.message);
	return <p className="text-lg font-bold text-red-500">加载评论内容失败。</p>;
};

export default function NewWalineComments() {
	const [updateHooker, forceUpdate] = useReducer((x) => x + 1, 0);
	return (
		<NewWalineCommentsDataProvider>
			<div id="comment" className="text-start w-full">
				<NewWalineCommentArea forceUpdate={forceUpdate} />
				<div id="comment-content">
					<ErrorBoundary fallbackRender={NewWalineErrorHandler}>
						<Suspense fallback={<CommentsLoading />}>
							<NewWalineCommentCards updateHooker={updateHooker} />
						</Suspense>
					</ErrorBoundary>
				</div>
			</div>
		</NewWalineCommentsDataProvider>
	);
}

export function NewWalineCommentArea({
	forceUpdate,
}: {
	forceUpdate: DispatchWithoutAction;
}) {
	const pathname = usePathname();
	const rid = useContext(ridContext);
	const pid = useContext(pidContext);
	const at = useContext(atContext);
	const setPid = useContext(setPidContext);
	const setRid = useContext(setRidContext);
	const setAt = useContext(setAtContext);
	const [nick, setNick] = useState("");
	const [mail, setMail] = useState("");
	const [url, setUrl] = useState("");
	const [submitAvailable, setSubmitAvailable] = useState(true);
	const [content, setContent] = useState("");
	const onSubmit = useCallback(() => {
		if (nick === "") {
			alert("请填写昵称！");
			return;
		}
		if (mail === "") {
			alert("请填写邮箱！");
			return;
		}
		if (content === "") {
			alert("请勿提交空白评论！");
			return;
		}
		setSubmitAvailable(false);
		addComment({
			...api_option,
			comment: {
				comment: content,
				url: pathname,
				ua: navigator.userAgent,
				nick,
				mail,
				link: url === "" ? undefined : url,
				pid: pid === "" ? undefined : pid,
				rid: rid === "" ? undefined : rid,
				at: at === "" ? undefined : at,
			},
		}).then((v) => {
			if (v.errmsg) {
				alert("评论失败，请稍后重试！");
				setSubmitAvailable(true);
				return;
			}
			setNick("");
			setMail("");
			setUrl("");
			setPid("");
			setRid("");
			setAt("");
			setContent("");
			setSubmitAvailable(true);
			forceUpdate();
		});
	}, [
		nick,
		mail,
		content,
		pathname,
		url,
		pid,
		rid,
		at,
		setPid,
		setRid,
		setAt,
		forceUpdate,
	]);
	return (
		<div
			id="comment-area"
			className="flex rounded-lg w-full bg-white dark:bg-gray-950 border-gray-950/10 dark:border-white/10 border-[1.5px] flex-wrap darkani">
			<div className="px-1 flex overflow-hidden w-full border-b-2 border-gray-950/10 dark:border-white/10 border-dashed">
				<div className="flex flex-1 items-center">
					<label className="px-3 py-2 text-xs font-light align-baseline darkani">
						昵称
					</label>
					<input
						className="resize-none w-0 max-w-full p-2 flex-1 bg-transparent border-none outline-none align-baseline text-xs darkani"
						onChange={(e) => {
							setNick(e.target.value);
						}}
						value={nick}
						type="text"
					/>
				</div>
				<div className="flex flex-1 items-center">
					<label className="px-3 py-2 text-xs font-light align-baseline darkani">
						邮箱
					</label>
					<input
						className="resize-none w-0 max-w-full p-2 flex-1 bg-transparent border-none outline-none align-baseline text-xs darkani"
						onChange={(e) => {
							setMail(e.target.value);
						}}
						value={mail}
						type="email"
					/>
				</div>
				<div className="flex flex-1 items-center">
					<label className="px-3 py-2 text-xs font-light align-baseline darkani">
						网站（可选）
					</label>
					<input
						className="resize-none w-0 max-w-full p-2 flex-1 bg-transparent border-none outline-none align-baseline text-xs darkani"
						onChange={(e) => {
							setUrl(e.target.value);
						}}
						value={url}
						type="url"
					/>
				</div>
			</div>
			<textarea
				className="w-full mx-2 my-3 outline-none bg-transparent resize-none h-28"
				onChange={(e) => {
					setContent(e.target.value);
				}}
				value={content}
			/>
			<div className="mx-3 my-2 flex overflow-hidden w-full items-center justify-between">
				<div className="flex items-center gap-4">
					{pid !== "" && (
						<p
							className="opacity-60 text-xs cursor-pointer darkani"
							title="点击取消回复"
							onClick={() => {
								setPid("");
								setRid("");
								setAt("");
							}}>
							正在回复 #{pid}
						</p>
					)}
				</div>
				<div className="flex items-center gap-4">
					<p className="opacity-60 text-xs">{content.length.toString()} 字</p>
					<button
						className={connectString([
							"bg-primary hover:opacity-90 px-4 py-1 text-white text-sm rounded-xl",
							submitAvailable ? "" : "filter brightness-75",
						])}
						disabled={!submitAvailable}
						onClick={onSubmit}>
						提交
					</button>
				</div>
			</div>
		</div>
	);
}

export function UpdateButton({
	c,
	parent,
}: {
	c: WalineComment;
	parent?: string;
}) {
	const pid = useContext(pidContext);
	const setPid = useContext(setPidContext);
	const setRid = useContext(setRidContext);
	const setAt = useContext(setAtContext);
	return (
		<button
			className={connectString([
				"absolute top-0 right-2 opacity-80 hover:text-primary transition-colors duration-500",
				pid === c.objectId ? "text-primary" : "tex-black dark:text-gray-300/80",
			])}
			onClick={() => {
				if (pid !== c.objectId) {
					setPid(c.objectId);
					setRid(parent === undefined ? c.objectId : parent);
					setAt(c.nick);
					setTimeout(() => {
						document.getElementById("comment-area")!.scrollIntoView({
							block: "center",
							behavior: "smooth",
						});
					}, 10);
					return;
				}
				setPid("");
				setRid("");
				setAt("");
			}}>
			<FontAwesomeIcon icon={faCommentAlt} />
		</button>
	);
}

export function NewWalineCommentCard({
	c,
	parent,
}: {
	c: WalineComment;
	parent?: string;
}) {
	return (
		<div className="flex p-2 relative gap-3">
			<div>
				<img
					className="rounded-full md:w-16 w-11 h-auto"
					src={c.avatar}
					alt="avatar"
				/>
			</div>
			<div className="flex flex-1 pb-2 flex-col gap-1">
				<div className="overflow-hidden relative w-full lh-1.75">
					{c.link !== null &&
					(c.link.startsWith("http://") || c.link.startsWith("https://")) ? (
						<a
							href={c.link}
							className="inline-block text-sm font-bold text-primary">
							{c.nick}
						</a>
					) : (
						<p className="inline-block text-sm font-bold darkani">{c.nick}</p>
					)}
					{(c.avatar === getAvatar("allenyou1126@gmail.com") ||
						c.avatar === getAvatar("i@allenyou.wang")) && (
						<span className="inline-block rounded-md bg-primary/30 text-primary text-xs px-1 py-0.5 ml-2">
							博主
						</span>
					)}
					<span className="inline-block text-xs ml-2 opacity-60 darkani">
						{new Date(c.time).toLocaleDateString()}
					</span>
					<span className="inline-block text-xs ml-2 opacity-60 darkani">
						#{c.objectId}
					</span>
					{parent !== undefined && (
						<span className="inline-block text-xs ml-2 opacity-60 darkani">
							<FontAwesomeIcon icon={faReply} /> #
							{(c as WalineChildComment).pid}
						</span>
					)}
					<br />
					<span className="inline-block rounded-md opacity-60 dark:bg-opacity-30 bg-opacity-50 bg-gray-300 text-xs px-1 py-0.5 mr-2 darkani">
						{c.browser}
					</span>
					<span className="inline-block rounded-md opacity-60 dark:bg-opacity-30 bg-opacity-50 bg-gray-300 text-xs px-1 py-0.5 mr-2 darkani">
						{c.os}
					</span>
					<UpdateButton c={c} parent={parent} />
				</div>
				<div className="w-full comment prose prose-ay dark:prose-invert max-w-none text-sm lh-1.75 break-all">
					{toJsxRuntime(
						fromHtml(c.comment, {
							fragment: true,
						}),
						{
							Fragment,
							components: {},
							ignoreInvalidStyle: true,
							jsx,
							jsxs,
							passNode: true,
						}
					)}
				</div>
				{(c as WalineRootComment).children !== undefined && (
					<div>
						{(c as WalineRootComment).children.map((v) => {
							return (
								<NewWalineCommentCard
									c={v}
									parent={c.objectId}
									key={v.objectId}
								/>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}

export function NewWalineCommentCards(props: { updateHooker: number }) {
	const [page, setPage] = useState(1);
	const pathname = usePathname();
	const { data } = useSWR(
		{ path: pathname, page: page },
		({ path, page }: { path: string; page: number }) => {
			return getComment({
				...api_option,
				path: path,
				pageSize: 10,
				page: page,
				sortBy: "insertedAt_desc",
			});
		},
		{
			suspense: true,
		}
	);
	const ret = data!;
	const total = ret.totalPages;
	return (
		<>
			{ret.count === 0 ? (
				<p className="text-xl font-bold my-4 darkani">没有评论</p>
			) : (
				<p className="text-xl font-bold my-4 darkani">{ret.count} 条评论</p>
			)}
			<div id="comment-list">
				{ret.data.map((c) => {
					return <NewWalineCommentCard key={c.objectId} c={c} />;
				})}
			</div>
			<div
				className={connectString([
					total <= 1 ? "hidden" : "",
					" relative h-12 mt-8",
				])}>
				<p className="absolute top-2/4 -translate-y-2/4 left-0 right-0 m-auto text-center text-base darkani">{`第${page}页，共${total}页`}</p>
				<button
					className={connectString([
						page <= 1 ? "hidden" : "",
						"absolute left-0 px-4 py-2 rounded-3xl bg-primary text-base top-2/4 -translate-y-2/4 font-bold text-white hover:opacity-90",
					])}
					onClick={() => {
						setPage(page - 1);
					}}>
					上一页
				</button>
				<button
					className={connectString([
						page >= total ? "hidden" : "",
						"absolute right-0 px-4 py-2 rounded-3xl bg-primary text-base top-2/4 -translate-y-2/4 font-bold text-white hover:opacity-90",
					])}
					onClick={() => {
						setPage(page + 1);
					}}>
					下一页
				</button>
			</div>
		</>
	);
}
