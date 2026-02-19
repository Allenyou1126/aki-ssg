declare type Content = {
	original_content: string;
	markdown_content: RenderableContent;
};
declare type PageMetadata = {
	slug: string;
	title: string;
	enable_comment: boolean;
	allow_index: boolean;
	navigation_title?: string;
	navigation_index: number;
	draft: boolean;
};
declare type Page = Content & PageMetadata;
declare type PostMetadata = {
	id: number;
	title: string;
	description: string;
	created_at: Date;
	modified_at: Date;
	draft: boolean;
};
declare type Post = PostMetadata & Content;
declare interface RenderableContent {
	toReactNode(): React.ReactNode;
	toToc(): Result;
	toRssFeed(): string;
	serialize(): string;
}
declare type TocItem = {
	display: string;
	id: string;
	level: number;
	child: TocItem[];
	parent?: TocItem;
};
