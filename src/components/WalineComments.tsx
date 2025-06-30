/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client";

import { config } from "@/data/site-config";
import "@/styles/waline.css";
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
import { connectString } from "@/utils/connectString";
import getAvatar from "@/utils/getAvatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentAlt } from "@fortawesome/free-regular-svg-icons";
import { faReply } from "@fortawesome/free-solid-svg-icons";
import { CommentsLoading } from "./Comments";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { fromHtml } from "hast-util-from-html";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import useSWR from "swr";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { delay } from "@/utils/delay";
import { scrollIntoViewById } from "@/utils/scrollIntoView";

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

function WalineCommentsDataProvider({
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

const WalineErrorHandler = (props: FallbackProps) => {
	console.error(props.error.message);
	return <p id="comment-error">加载评论内容失败。</p>;
};

export default function WalineComments() {
	const cardsRef = useRef<{ reload: () => void }>(null);
	return (
		<WalineCommentsDataProvider>
			<div id="comment">
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
		setPid,
		setRid,
		setAt,
		updateFunction,
	]);
	return (
		<div id="comment-area">
			<div className="comment-area-metadata">
				<div className="comment-area-metadata-item">
					<label className="comment-area-metadata-label">昵称*</label>
					<input
						className="comment-area-metadata-input"
						onChange={(e) => {
							setNick(e.target.value);
						}}
						value={nick}
						type="text"
					/>
				</div>
				<div className="comment-area-metadata-item">
					<label className="comment-area-metadata-label">邮箱*</label>
					<input
						className="comment-area-metadata-input"
						onChange={(e) => {
							setMail(e.target.value);
						}}
						value={mail}
						type="email"
					/>
				</div>
				<div className="comment-area-metadata-item">
					<label className="comment-area-metadata-label">网站</label>
					<input
						className="comment-area-metadata-input"
						onChange={(e) => {
							setUrl(e.target.value);
						}}
						value={url}
						type="url"
					/>
				</div>
			</div>
			<textarea
				id="comment-area-input"
				onChange={(e) => {
					setContent(e.target.value);
				}}
				value={content}
			/>
			<div id="comment-area-bar">
				<div className="comment-area-bar-part">
					{pid !== "" && (
						<p
							style={{ cursor: "pointer" }}
							className="comment-area-bar-text"
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
				<div className="comment-area-bar-part">
					<p className="comment-area-bar-text">
						{content.length.toString()} 字
					</p>
					<button
						style={{
							filter: submitAvailable ? undefined : "brightness(0.75)",
						}}
						className="comment-area-bar-button"
						disabled={!submitAvailable}
						onClick={onSubmit}>
						提交
					</button>
				</div>
			</div>
		</div>
	);
}

function UpdateButton({ c, parent }: { c: WalineComment; parent?: string }) {
	const pid = useContext(pidContext);
	const setPid = useContext(setPidContext);
	const setRid = useContext(setRidContext);
	const setAt = useContext(setAtContext);
	const onClick = useCallback(() => {
		if (pid !== c.objectId) {
			setPid(c.objectId);
			setRid(parent === undefined ? c.objectId : parent);
			setAt(c.nick);
			delay(10).then(() => {
				scrollIntoViewById("comment-area");
			});
			return;
		}
		setPid("");
		setRid("");
		setAt("");
	}, [pid, c.objectId, c.nick, setPid, setRid, setAt, parent]);
	return (
		<button
			style={{
				color: pid === c.objectId ? "var(--primary)" : undefined,
			}}
			className="comment-update-button"
			onClick={onClick}>
			<FontAwesomeIcon icon={faCommentAlt} />
		</button>
	);
}

function WalineCommentCard({
	c,
	parent,
}: {
	c: WalineComment;
	parent?: string;
}) {
	return (
		<div className="comment-card">
			<div>
				<img className="comment-avatar" src={c.avatar} alt="avatar" />
			</div>
			<div className="comment-data">
				<div className="comment-metadata">
					{c.link !== null &&
					(c.link.startsWith("http://") || c.link.startsWith("https://")) ? (
						<a
							href={c.link}
							style={{ color: "var(--primary)" }}
							className="comment-nick">
							{c.nick}
						</a>
					) : (
						<p className="comment-nick">{c.nick}</p>
					)}
					{c.avatar === getAvatar(config.author.email) && (
						<span className="comment-tag owner-tag">博主</span>
					)}
					<span className="comment-metadata-text">
						{new Date(c.time).toLocaleDateString()}
					</span>
					<span className="comment-metadata-text">#{c.objectId}</span>
					{parent !== undefined && (
						<span className="comment-metadata-text">
							<FontAwesomeIcon icon={faReply} /> #
							{(c as WalineChildComment).pid}
						</span>
					)}
					<br />
					<span className="comment-tag">{c.browser}</span>
					<span className="comment-tag">{c.os}</span>
					<UpdateButton c={c} parent={parent} />
				</div>
				<div className="comment content">
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
				<p id="comment-count">没有评论</p>
			) : (
				<p id="comment-count">{ret.count} 条评论</p>
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
				className="page-switcher-wrap">
				<p className="page-switcher page-switcher-page">{`第${page}页，共${total}页`}</p>
				<button
					style={{
						left: 0,
						display: page <= 1 ? "none" : undefined,
					}}
					className="page-switcher page-switcher-button"
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
					className="page-switcher page-switcher-button"
					onClick={() => {
						setPage(page + 1);
					}}>
					下一页
				</button>
			</div>
		</>
	);
}
