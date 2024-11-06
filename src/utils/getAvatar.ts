import { config } from "@/data/site-config";
import md5 from "md5-ts";

export default function getAvatar(
	email: string = "test@example.com",
	size: number = 80
): string {
	return `${config.optimize.gravatar_mirror}${md5(email)}?s=${size}`;
}
