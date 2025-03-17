declare type AuthorConfig = {
	name: string;
	email: string;
};

declare type BlogConfig = {
	hostname: string;
	title: string;
	description: string;
	favicon: string;
};

declare type DisableCommentConfig = { type: "disable" };
declare type WalineCommentConfig = { type: "waline"; waline_api: string };

declare type CommentConfig = DisableCommentConfig | WalineCommentConfig;

declare type FollowConfig = {
	user_id: string;
	feed_id: string;
};

declare type StyleConfig = {
	primary_color: string;
	header_image: {
		default: string;
		dark: string;
	};
};

declare type PartialStyleConfig = {
	primary_color?: string;
	header_image?:
		| {
				default: string;
				dark: string;
		  }
		| string;
};

declare type OptimizeConfig = {
	gravatar_mirror: string;
	cdn_prefix?: string;
	thumb_query?: string;
	meme_base_url?: string;
};

declare type SiteConfig = {
	author: AuthorConfig;
	blog: BlogConfig;
	style: StyleConfig;
	comment: CommentConfig;
	follow?: FollowConfig;
	optimize: OptimizeConfig;
};

declare type PartialSiteConfig = {
	author?: Partial<AuthorConfig>;
	blog?: Partial<BlogConfig>;
	style?: PartialStyleConfig;
	comment?: CommentConfig;
	follow?: FollowConfig;
	optimize?: Partial<OptimizeConfig>;
};
