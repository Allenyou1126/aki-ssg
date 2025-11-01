/* eslint-disable @next/next/no-img-element */
"use client";

import { config } from "@/data/site-config";
import {
	createContext,
	ForwardedRef,
	useCallback,
	useContext,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import { usePathname } from "next/navigation";
import { addComment, getComment } from "@waline/api";
import type { WalineRootComment, WalineComment } from "@waline/api";
import getAvatar from "@/utils/getAvatar";
import { CommentsLoading } from "../CommentsLoading";
import useSWR from "swr";
import { delay } from "@/utils/delay";
import { scrollIntoViewById } from "@/utils/scrollIntoView";
import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";
import * as stylex from "@stylexjs/stylex";
import { PageSwitcher } from "@/components/PageSwitcher";
import { themeTokens } from "@/styles/variables.stylex";
import { MarkdownContent } from "@/components/MarkdownContent";
import { fromHtmlToNodes } from "@/libs/markdown-client";

function getApiOptions() {
	const commentConfig = config.comment;
	if (commentConfig.type !== "waline") {
		return {
			serverURL: "",
			lang: "zh",
		};
	}
	return {
		serverURL: commentConfig.waline_api,
		lang: "zh",
	};
}

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

const iconStyle = stylex.create({
	icon: {
		display: "inline-block",
		fill: "currentColor",
		height: "1em",
		width: "1em",
	},
});

function Reply() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			{...stylex.props(iconStyle.icon)}
			viewBox="0 0 512 512">
			<path d="M205 34.8c11.5 5.1 19 16.6 19 29.2l0 64 112 0c97.2 0 176 78.8 176 176c0 113.3-81.5 163.9-100.2 174.1c-2.5 1.4-5.3 1.9-8.1 1.9c-10.9 0-19.7-8.9-19.7-19.7c0-7.5 4.3-14.4 9.8-19.5c9.4-8.8 22.2-26.4 22.2-56.7c0-53-43-96-96-96l-96 0 0 64c0 12.6-7.4 24.1-19 29.2s-25 3-34.4-5.4l-160-144C3.9 225.7 0 217.1 0 208s3.9-17.7 10.6-23.8l160-144c9.4-8.5 22.9-10.6 34.4-5.4z" />
		</svg>
	);
}

function Message() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			{...stylex.props(iconStyle.icon)}
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

const mainStyle = stylex.create({
	container: {
		textAlign: "start",
		width: "100%",
	},
	error: {
		color: "rgb(239 68 68)",
		fontSize: "1.125rem",
		fontWeight: 700,
		lineHeight: "1.75rem",
	},
});

const WalineErrorHandler = (props: { error: Error }) => {
	console.error(props.error.message);
	return <p {...stylex.props(mainStyle.error)}>加载评论内容失败。</p>;
};

export default function WalineComments() {
	const cardsRef = useRef<{ reload: () => void }>(null);
	return (
		<WalineCommentsDataProvider>
			<div {...stylex.props(mainStyle.container)}>
				<WalineCommentArea
					updateFunction={() => {
						cardsRef.current?.reload();
					}}
				/>
				<div>
					<WalineCommentCards ref={cardsRef} />
				</div>
			</div>
		</WalineCommentsDataProvider>
	);
}

const inputAreaStyle = stylex.create({
	area: {
		backgroundColor: "var(--bg)",
		borderColor: "rgb(from var(--border) r g b / 10)",
		borderRadius: "0.5rem",
		borderStyle: "solid",
		borderWidth: "1.5px",
		display: "flex",
		flexWrap: "wrap",
		width: "100%",
	},
	main: {
		backgroundColor: "transparent",
		height: "7rem",
		marginBlock: "0.75rem",
		marginInline: "0.5rem",
		outlineStyle: "none",
		resize: "none",
		width: "100%",
	},
	bar: {
		alignItems: "center",
		display: "flex",
		justifyContent: "space-between",
		marginBlock: "0.75rem",
		marginInline: "0.5rem",
		overflow: "hidden",
		width: "100%",
	},
	button: {
		backgroundColor: themeTokens.primaryColor,
		borderRadius: "0.75rem",
		color: "rgb(255 255 255 / 1)",
		fontSize: "0.875rem",
		lineHeight: 1.75,
		opacity: {
			":hover": 0.9,
		},
		paddingBlock: "0.25rem",
		paddingInline: "1rem",
	},
	part: {
		alignItems: "center",
		display: "flex",
		gap: "1rem",
	},
	text: {
		fontSize: "0.75rem",
		lineHeight: 1.75,
		opacity: 0.6,
	},
	metadata: {
		borderBottomColor: "rgb(from var(--border) r g b / 10)",
		borderBottomStyle: "solid",
		borderBottomWidth: "2px",
		display: "flex",
		overflow: "hidden",
		paddingBlock: "0",
		paddingInline: "0.25rem",
		width: "100%",
	},
	item: {
		alignItems: "center",
		display: "flex",
		flex: "1 1 0%",
		fontSize: "0.75rem",
		lineHeight: 1.75,
	},
	label: {
		fontWeight: 300,
		padding: "0.5rem",
		verticalAlign: "baseline",
	},
	input: {
		backgroundColor: "transparent",
		borderStyle: "none",
		flex: "1 1 0%",
		maxWidth: "100%",
		outlineStyle: "none",
		padding: "0.5rem",
		resize: "none",
		verticalAlign: "baseline",
		width: 0,
	},
	pointer: {
		cursor: "pointer",
	},
	unavailable: {
		filter: "brightness(0.75)",
	},
});

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
			...getApiOptions(),
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
		<div id="comment-area" {...stylex.props(inputAreaStyle.area)}>
			<div {...stylex.props(inputAreaStyle.metadata)}>
				<div {...stylex.props(inputAreaStyle.item)}>
					<label {...stylex.props(inputAreaStyle.label)}>昵称*</label>
					<input
						{...stylex.props(inputAreaStyle.input)}
						onChange={(e) => {
							setNick(e.target.value);
						}}
						value={nick}
						type="text"
					/>
				</div>
				<div {...stylex.props(inputAreaStyle.item)}>
					<label {...stylex.props(inputAreaStyle.label)}>邮箱*</label>
					<input
						{...stylex.props(inputAreaStyle.input)}
						onChange={(e) => {
							setMail(e.target.value);
						}}
						value={mail}
						type="email"
					/>
				</div>
				<div {...stylex.props(inputAreaStyle.item)}>
					<label {...stylex.props(inputAreaStyle.label)}>网站</label>
					<input
						{...stylex.props(inputAreaStyle.input)}
						onChange={(e) => {
							setUrl(e.target.value);
						}}
						value={url}
						type="url"
					/>
				</div>
			</div>
			<textarea
				{...stylex.props(inputAreaStyle.main)}
				onChange={(e) => {
					setContent(e.target.value);
				}}
				value={content}
			/>
			<div {...stylex.props(inputAreaStyle.bar)}>
				<div {...stylex.props(inputAreaStyle.part)}>
					{pid && (
						<p
							{...stylex.props(inputAreaStyle.text, inputAreaStyle.pointer)}
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
				<div {...stylex.props(inputAreaStyle.part)}>
					<p {...stylex.props(inputAreaStyle.text)}>
						{content.length.toString()} 字
					</p>
					<button
						{...stylex.props(
							inputAreaStyle.button,
							!submitAvailable && inputAreaStyle.unavailable
						)}
						disabled={!submitAvailable}
						onClick={onSubmit}>
						提交
					</button>
				</div>
			</div>
		</div>
	);
}

const cardStyle = stylex.create({
	container: {
		display: "flex",
		flex: "1 1 0%",
		flexDirection: "column",
		gap: "0.25rem",
		paddingBottom: "0.5rem",
	},
	count: {
		fontSize: "1.25rem",
		fontWeight: 700,
		lineHeight: "1.75rem",
		marginBlock: "1rem",
		marginInline: "0",
	},
	card: {
		display: "flex",
		gap: "0.75rem",
		padding: "0.5rem",
		position: "relative",
	},
	meta: {
		lineHeight: 1.75,
		overflow: "hidden",
		position: "relative",
		width: "100%",
	},
	text: {
		display: "inline-block",
		fontSize: "0.75rem",
		lineHeight: "1rem",
		marginLeft: "0.5rem",
		opacity: 0.6,
	},
	nick: {
		display: "inline-block",
		fontSize: "0.875rem",
		fontWeight: 700,
		lineHeight: "1.25rem",
	},
	link: {
		color: themeTokens.primaryColor,
	},
	update: {
		color: {
			":hover": themeTokens.primaryColor,
		},
		opacity: 0.8,
		position: "absolute",
		right: "0.5rem",
		top: 0,
		transition: "color 0.5s ease",
	},
	avatar: {
		aspectRatio: "1 / 1",
		backgroundColor: themeTokens.primaryColor,
		borderRadius: "9999px",
		width: {
			default: "2.75rem",
			"@media (min-width: 768px)": "4rem",
		},
	},
	tag: {
		borderRadius: "0.375rem",
		display: "inline-block",
		fontSize: "0.75rem",
		lineHeight: "1rem",
		paddingBlock: "0.125rem",
		paddingInline: "0.25rem",
	},
	metaTag: {
		backgroundColor: "rgb(209 213 219 / 0.4)",
		marginRight: "0.5rem",
		opacity: 0.6,
	},
	ownerTag: {
		backgroundColor: `rgb(${themeTokens.primaryColor} / 0.4)`,
		color: themeTokens.primaryColor,
		marginLeft: "0.5rem",
		opacity: 1,
	},
});

function UpdateButton({
	comment,
	parentComment,
}: {
	comment: WalineComment;
	parentComment?: number;
}) {
	const pid = useContext(pidContext);
	const setPid = useContext(setPidContext);
	const setRid = useContext(setRidContext);
	const setAt = useContext(setAtContext);
	const onClick = useCallback(() => {
		if (pid !== comment.objectId) {
			setPid(comment.objectId);
			setRid(parentComment ?? comment.objectId);
			setAt(comment.nick);
			delay(10).then(() => {
				scrollIntoViewById("comment-area");
			});
			return;
		}
		setPid(undefined);
		setRid(undefined);
		setAt("");
	}, [
		pid,
		comment.objectId,
		comment.nick,
		setPid,
		setRid,
		setAt,
		parentComment,
	]);
	return (
		<button
			style={{
				color: pid === comment.objectId ? themeTokens.primaryColor : undefined,
			}}
			{...stylex.props(cardStyle.update)}
			onClick={onClick}>
			<Message />
		</button>
	);
}

function WalineSubCards({ comment }: { comment: WalineComment }) {
	const rootComment = comment as WalineRootComment;
	if (rootComment.children === undefined) {
		return <></>;
	}
	const subComments = rootComment.children.map((currentComment) => {
		return (
			<WalineCommentCard
				comment={currentComment}
				parentComment={rootComment.objectId}
				key={currentComment.objectId}
			/>
		);
	});
	return <div>{subComments}</div>;
}

function WalineCommentCard({
	comment,
	parentComment,
}: {
	comment: WalineComment;
	parentComment?: number;
}) {
	return (
		<div {...stylex.props(cardStyle.card)}>
			<div>
				<img
					{...stylex.props(cardStyle.avatar)}
					src={comment.avatar}
					alt="avatar"
				/>
			</div>
			<div {...stylex.props(cardStyle.container)}>
				<div {...stylex.props(cardStyle.meta)}>
					{comment.link !== null &&
					(comment.link.startsWith("http://") ||
						comment.link.startsWith("https://")) ? (
						<a
							href={comment.link}
							{...stylex.props(cardStyle.nick, cardStyle.link)}>
							{comment.nick}
						</a>
					) : (
						<p {...stylex.props(cardStyle.nick)}>{comment.nick}</p>
					)}
					{comment.avatar === getAvatar(config.author.email) && (
						<span {...stylex.props(cardStyle.tag, cardStyle.ownerTag)}>
							博主
						</span>
					)}
					<span {...stylex.props(cardStyle.text)}>
						{new Date(comment.time).toLocaleDateString()}
					</span>
					<span {...stylex.props(cardStyle.text)}>#{comment.objectId}</span>
					{parentComment && (
						<span {...stylex.props(cardStyle.text)}>
							<Reply /> {"#"}
							{parentComment}
						</span>
					)}
					<br />
					<span {...stylex.props(cardStyle.tag, cardStyle.metaTag)}>
						{comment.browser}
					</span>
					<span {...stylex.props(cardStyle.tag, cardStyle.metaTag)}>
						{comment.os}
					</span>
					<UpdateButton comment={comment} parentComment={parentComment} />
				</div>
				<MarkdownContent comment>
					{fromHtmlToNodes(comment.comment)}
				</MarkdownContent>
				<WalineSubCards comment={comment} />
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
	const {
		data: comments,
		error,
		isLoading,
		mutate,
	} = useSWR(
		{ path: pathname, page: page },
		({ path, page }: { path: string; page: number }) => {
			return getComment({
				...getApiOptions(),
				path,
				page,
				pageSize: 10,
				sortBy: "insertedAt_desc",
			});
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
	if (error) {
		return <WalineErrorHandler error={error} />;
	}
	if (isLoading || !comments) {
		return <CommentsLoading />;
	}
	const total = comments.totalPages;
	return (
		<>
			{comments.count ? (
				<p {...stylex.props(cardStyle.count)}>{comments.count} 条评论</p>
			) : (
				<p {...stylex.props(cardStyle.count)}>没有评论</p>
			)}
			<div>
				{comments.data.map((comment) => {
					return <WalineCommentCard key={comment.objectId} comment={comment} />;
				})}
			</div>
			<PageSwitcher
				total={total}
				current={page}
				navigation={{
					type: "client",
					action: (target: number) => {
						setPage(target);
					},
				}}
			/>
		</>
	);
}
