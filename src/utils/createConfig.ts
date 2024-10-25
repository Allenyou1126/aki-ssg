export function createConfig(c: PartialSiteConfig): SiteConfig {
	const ret: SiteConfig = {
		blog: {
			hostname: "example.com",
			title: "Aki-SSG",
			description: "Yet another site generated by Aki-SSG",
		},
		comment: {
			enabled: false,
		},
		gravatar_mirror: "https://gravatar.com/avatar/",
	};
	if (c.gravatar_mirror !== undefined) {
		ret.gravatar_mirror = c.gravatar_mirror;
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
	}
	if (c.follow !== undefined) {
		ret.follow = c.follow;
	}
	return ret;
}
