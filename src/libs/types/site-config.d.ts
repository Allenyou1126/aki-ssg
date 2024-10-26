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

declare type DisableCommentConfig = { enabled: false };
declare type WalineCommentConfig = { enabled: true; waline_api: string };

declare type CommentConfig = DisableCommentConfig | WalineCommentConfig;

declare type FollowConfig = {
	user_id: number;
	feed_id: number;
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

declare type SiteConfig = {
	author: AuthorConfig;
	blog: BlogConfig;
	style: StyleConfig;
	comment: CommentConfig;
	gravatar_mirror: string;
	follow?: FollowConfig;
};

declare type PartialSiteConfig = {
	author?: Partial<AuthorConfig>;
	blog?: Partial<BlogConfig>;
	style?: PartialStyleConfig;
	comment?: CommentConfig;
	gravatar_mirror?: string;
	follow?: FollowConfig;
};
