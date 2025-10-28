/* eslint-disable @next/next/no-img-element */
"use client";

import style from "./style.module.css";
import proseStyle from "@/styles/content.module.css";
import pageSwitcher from "@/styles/utils/page-switcher.module.css";
import "@/components/Comments/WalineComments/style.css";
import { config } from "@/data/site-config";
import {
	createContext,
	ForwardedRef,
	Suspense,
	useCallback,
	useContext,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import { usePathname } from "next/navigation";
import { addComment, getComment } from "@waline/api";
import type {
	WalineRootComment,
	WalineChildComment,
	WalineComment,
} from "@waline/api";
import getAvatar from "@/utils/getAvatar";
import { CommentsLoading } from "../CommentsLoading";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { fromHtml } from "hast-util-from-html";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import useSWR from "swr";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { delay } from "@/utils/delay";
import { scrollIntoViewById } from "@/utils/scrollIntoView";
import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";

const api_option = {
	serverURL: (config.comment as WalineCommentConfig).waline_api,
	lang: "zh",
};

const pidContext = createContext<number | undefined>(undefined);
const ridContext = createContext<number | undefined>(undefined);
const atContext = createContext("");
const setPidContext = createContext((v: number | undefined) => {
	console.warn("setPidContext is not set: ", v);
});
const setRidContext = createContext((v: number | undefined) => {
	console.warn("setRidContext is not set: ", v);
});
const setAtContext = createContext((v: string) => {
	console.warn("setAtContext is not set: ", v);
});

const nickStorage = atomWithStorage("waline-nick", "");
const mailStorage = atomWithStorage("waline-mail", "");
const urlStorage = atomWithStorage("waline-url", "");

function Reply() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			style={{
				width: "1em",
				height: "1em",
				display: "inline-block",
				fill: "currentColor",
			}}
			viewBox="0 0 512 512">
			<path d="M205 34.8c11.5 5.1 19 16.6 19 29.2l0 64 112 0c97.2 0 176 78.8 176 176c0 113.3-81.5 163.9-100.2 174.1c-2.5 1.4-5.3 1.9-8.1 1.9c-10.9 0-19.7-8.9-19.7-19.7c0-7.5 4.3-14.4 9.8-19.5c9.4-8.8 22.2-26.4 22.2-56.7c0-53-43-96-96-96l-96 0 0 64c0 12.6-7.4 24.1-19 29.2s-25 3-34.4-5.4l-160-144C3.9 225.7 0 217.1 0 208s3.9-17.7 10.6-23.8l160-144c9.4-8.5 22.9-10.6 34.4-5.4z" />
		</svg>
	);
}

function Message() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="1em"
			height="1em"
			fill="currentColor"
			viewBox="0 0 512 512">
			<path d="M160 368c26.5 0 48 21.5 48 48l0 16 72.5-54.4c8.3-6.2 18.4-9.6 28.8-9.6L448 368c8.8 0 16-7.2 16-16l0-288c0-8.8-7.2-16-16-16L64 48c-8.8 0-16 7.2-16 16l0 288c0 8.8 7.2 16 16 16l96 0zm48 124l-.2 .2-5.1 3.8-17.1 12.8c-4.8 3.6-11.3 4.2-16.8 1.5s-8.8-8.2-8.8-14.3l0-21.3 0-6.4 0-.3 0-4 0-48-48 0-48 0c-35.3 0-64-28.7-64-64L0 64C0 28.7 28.7 0 64 0L448 0c35.3 0 64 28.7 64 64l0 288c0 35.3-28.7 64-64 64l-138.7 0L208 492z" />
		</svg>
	);
}

function WalineCommentsDataProvider({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const [pid, setPid] = useState<number | undefined>(undefined);
	const [rid, setRid] = useState<number | undefined>(undefined);
	const [at, setAt] = useState("");
	return (
		<pidContext.Provider value={pid}>
			<ridContext.Provider value={rid}>
				<atContext.Provider value={at}>
					<setRidContext.Provider
						value={(v: number | undefined) => {
							setRid(v);
						}}>
						<setPidContext.Provider
							value={(v: number | undefined) => {
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

const WalineErrorHandler = (props: FallbackProps) => {
	console.error(props.error.message);
	return <p className={style.error}>加载评论内容失败。</p>;
};

export default function WalineComments() {
	const cardsRef = useRef<{ reload: () => void }>(null);
	return (
		<WalineCommentsDataProvider>
			<div className={style.container}>
				<WalineCommentArea
					updateFunction={() => {
						cardsRef.current?.reload();
					}}
				/>
				<div>
					<ErrorBoundary fallbackRender={WalineErrorHandler}>
						<Suspense fallback={<CommentsLoading />}>
							<WalineCommentCards ref={cardsRef} />
						</Suspense>
					</ErrorBoundary>
				</div>
			</div>
		</WalineCommentsDataProvider>
	);
}

function WalineCommentArea({ updateFunction }: { updateFunction: () => void }) {
	const pathname = usePathname();
	const rid = useContext(ridContext);
	const pid = useContext(pidContext);
	const at = useContext(atContext);
	const setPid = useContext(setPidContext);
	const setRid = useContext(setRidContext);
	const setAt = useContext(setAtContext);
	const [nickStorageValue, setNickStorageValue] = useAtom(nickStorage);
	const [mailStorageValue, setMailStorageValue] = useAtom(mailStorage);
	const [urlStorageValue, setUrlStorageValue] = useAtom(urlStorage);
	const [nick, setNick] = useState(nickStorageValue);
	const [mail, setMail] = useState(mailStorageValue);
	const [url, setUrl] = useState(urlStorageValue);
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
				pid,
				rid,
				at: at === "" ? undefined : at,
			},
		}).then((v) => {
			if (v.errmsg) {
				alert("评论失败，请稍后重试！");
				setSubmitAvailable(true);
				return;
			}
			setNickStorageValue(nick);
			setMailStorageValue(mail);
			setUrlStorageValue(url);
			setPid(undefined);
			setRid(undefined);
			setAt("");
			setContent("");
			setSubmitAvailable(true);
			updateFunction();
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
		setNickStorageValue,
		setMailStorageValue,
		setUrlStorageValue,
		setPid,
		setRid,
		setAt,
		updateFunction,
	]);
	return (
		<div id="comment-area" className={style.area}>
			<div className={style.metadata}>
				<div className={style.metadataItem}>
					<label className={style.metadataLabel}>昵称*</label>
					<input
						className={style.metadataInput}
						onChange={(e) => {
							setNick(e.target.value);
						}}
						value={nick}
						type="text"
					/>
				</div>
				<div className={style.metadataItem}>
					<label className={style.metadataLabel}>邮箱*</label>
					<input
						className={style.metadataInput}
						onChange={(e) => {
							setMail(e.target.value);
						}}
						value={mail}
						type="email"
					/>
				</div>
				<div className={style.metadataItem}>
					<label className={style.metadataLabel}>网站</label>
					<input
						className={style.metadataInput}
						onChange={(e) => {
							setUrl(e.target.value);
						}}
						value={url}
						type="url"
					/>
				</div>
			</div>
			<textarea
				className={style.areaInput}
				onChange={(e) => {
					setContent(e.target.value);
				}}
				value={content}
			/>
			<div className={style.areaBar}>
				<div className={style.areaBarPart}>
					{pid && (
						<p
							style={{ cursor: "pointer" }}
							className={style.areaBarText}
							title="点击取消回复"
							onClick={() => {
								setPid(undefined);
								setRid(undefined);
								setAt("");
							}}>
							正在回复 #{pid}
						</p>
					)}
				</div>
				<div className={style.areaBarPart}>
					<p className={style.areaBarText}>{content.length.toString()} 字</p>
					<button
						style={{
							filter: submitAvailable ? undefined : "brightness(0.75)",
						}}
						className={style.areaBarButton}
						disabled={!submitAvailable}
						onClick={onSubmit}>
						提交
					</button>
				</div>
			</div>
		</div>
	);
}

function UpdateButton({ c, parent }: { c: WalineComment; parent?: number }) {
	const pid = useContext(pidContext);
	const setPid = useContext(setPidContext);
	const setRid = useContext(setRidContext);
	const setAt = useContext(setAtContext);
	const onClick = useCallback(() => {
		if (pid !== c.objectId) {
			setPid(c.objectId);
			setRid(parent ?? c.objectId);
			setAt(c.nick);
			delay(10).then(() => {
				scrollIntoViewById("comment-area");
			});
			return;
		}
		setPid(undefined);
		setRid(undefined);
		setAt("");
	}, [pid, c.objectId, c.nick, setPid, setRid, setAt, parent]);
	return (
		<button
			style={{
				color: pid === c.objectId ? "var(--primary)" : undefined,
			}}
			className={style.updateButton}
			onClick={onClick}>
			<Message />
		</button>
	);
}

function WalineCommentCard({
	c,
	parent,
}: {
	c: WalineComment;
	parent?: number;
}) {
	return (
		<div className={style.card}>
			<div>
				<img className={style.avatar} src={c.avatar} alt="avatar" />
			</div>
			<div className={style.data}>
				<div className={style.meta}>
					{c.link !== null &&
					(c.link.startsWith("http://") || c.link.startsWith("https://")) ? (
						<a
							href={c.link}
							style={{ color: "var(--primary)" }}
							className={style.nick}>
							{c.nick}
						</a>
					) : (
						<p className={style.nick}>{c.nick}</p>
					)}
					{c.avatar === getAvatar(config.author.email) && (
						<span className={style.ownerTag}>博主</span>
					)}
					<span className={style.metaText}>
						{new Date(c.time).toLocaleDateString()}
					</span>
					<span className={style.metaText}>#{c.objectId}</span>
					{parent && (
						<span className={style.metaText}>
							<Reply /> #{(c as WalineChildComment).pid}
						</span>
					)}
					<br />
					<span className={style.commentTag}>{c.browser}</span>
					<span className={style.commentTag}>{c.os}</span>
					<UpdateButton c={c} parent={parent} />
				</div>
				<div className={["comment", proseStyle.prose].join(" ")}>
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
								<WalineCommentCard c={v} parent={c.objectId} key={v.objectId} />
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}

function WalineCommentCards({
	ref,
}: {
	ref: ForwardedRef<{ reload: () => void }>;
}) {
	const [page, setPage] = useState(1);
	const pathname = usePathname();
	const { data, mutate } = useSWR(
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
	useImperativeHandle(
		ref,
		() => {
			return {
				reload: () => {
					mutate();
				},
			};
		},
		[mutate]
	);
	const ret = data!;
	const total = ret.totalPages;
	return (
		<>
			{ret.count === 0 ? (
				<p className={style.count}>没有评论</p>
			) : (
				<p className={style.count}>{ret.count} 条评论</p>
			)}
			<div>
				{ret.data.map((c) => {
					return <WalineCommentCard key={c.objectId} c={c} />;
				})}
			</div>
			<div
				style={{
					display: total <= 1 ? "none" : undefined,
				}}
				className={pageSwitcher.wrap}>
				<p className={pageSwitcher.page}>{`第${page}页，共${total}页`}</p>
				<button
					style={{
						left: 0,
						display: page <= 1 ? "none" : undefined,
					}}
					className={pageSwitcher.button}
					onClick={() => {
						setPage(page - 1);
					}}>
					上一页
				</button>
				<button
					style={{
						right: 0,
						display: page >= total ? "none" : undefined,
					}}
					className={pageSwitcher.button}
					onClick={() => {
						setPage(page + 1);
					}}>
					下一页
				</button>
			</div>
		</>
	);
}
