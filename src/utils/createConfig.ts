export function createConfig(c: PartialSiteConfig): SiteConfig {
	const ret: SiteConfig = {
		author: {
			name: "Test",
			email: "test@example.com",
		},
		blog: {
			hostname: "example.com",
			title: "Aki-SSG",
			description: "Yet another site generated by Aki-SSG",
			favicon: "/favicon.ico",
			begin_year: 2024,
		},
		style: {
			primary_color: "#6db0ec",
			header_image: {
				default: "/header-image.jpg",
				dark: "/header-image-dark.jpg",
			},
		},
		comment: {
			type: "disable",
		},
		optimize: {
			gravatar_mirror: "https://gravatar.com/avatar/",
		},
	};
	if (c.optimize?.gravatar_mirror !== undefined) {
		ret.optimize.gravatar_mirror = c.optimize.gravatar_mirror;
	}
	if (c.optimize?.cdn_prefix !== undefined) {
		ret.optimize.cdn_prefix = c.optimize.cdn_prefix;
	}
	if (c.optimize?.thumb_query !== undefined) {
		ret.optimize.thumb_query = c.optimize.thumb_query;
	}
	if (c.optimize?.meme_base_url !== undefined) {
		ret.optimize.meme_base_url = c.optimize.meme_base_url;
	}
	if (c.comment !== undefined) {
		ret.comment = c.comment;
	}
	if (c.blog !== undefined) {
		if (c.blog.hostname !== undefined) {
			ret.blog.hostname = c.blog.hostname;
		}
		if (c.blog.description !== undefined) {
			ret.blog.description = c.blog.description;
		}
		if (c.blog.title !== undefined) {
			ret.blog.title = c.blog.title;
		}
		if (c.blog.favicon !== undefined) {
			ret.blog.favicon = c.blog.favicon;
		}
		if (c.blog.begin_year !== undefined) {
			ret.blog.begin_year = c.blog.begin_year;
		}
	}
	if (c.author !== undefined) {
		if (c.author.name !== undefined) {
			ret.author.name = c.author.name;
		}
		if (c.author.email !== undefined) {
			ret.author.email = c.author.email;
		}
	}
	if (c.follow !== undefined) {
		ret.follow = c.follow;
	}
	if (c.style !== undefined) {
		if (c.style.primary_color !== undefined) {
			ret.style.primary_color = c.style.primary_color;
		}
		if (c.style.header_image !== undefined) {
			if (typeof c.style.header_image === "string") {
				ret.style.header_image.default = c.style.header_image;
				ret.style.header_image.dark = c.style.header_image;
			} else {
				ret.style.header_image = c.style.header_image;
			}
		}
	}
	return ret;
}
