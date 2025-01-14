import { config } from "@/data/site-config";
import md5 from "md5-ts";

export default function getAvatar(
	email: string = "test@example.com",
	size?: number
): string {
	if (!size) {
		return `${config.optimize.gravatar_mirror}${md5(email)}`;
	}
	return `${config.optimize.gravatar_mirror}${md5(email)}?s=${size}`;
}
