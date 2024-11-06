import { config } from "@/data/site-config";

export function getThumbUrl(image: string) {
	return `${image}${
		config.optimize.thumb_query === undefined ? "" : config.optimize.thumb_query
	}`;
}
