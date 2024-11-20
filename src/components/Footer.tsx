import { config } from "@/data/site-config";
import Link from "next/link";

export default async function Footer() {
	return (
		<footer className="bottom-0 relative items-center flex-col flex my-3 gap-3 justify-center w-full text-center py-4">
			<p>
				Copyright © 2024-{new Date().getFullYear()} {config.author.name}
			</p>
			<p className="opacity-70">
				Powered by{" "}
				<Link href="https://github.com/Allenyou1126/aki-ssg">Aki-SSG</Link>
			</p>
			<div className="opacity-70 flex flex-row flex-nowrap gap-8">
				<Link className="block" href="/feed.xml">
					RSS Feed
				</Link>
				<Link className="block" href="/sitemap.xml">
					Sitemap
				</Link>
			</div>
		</footer>
	);
}
