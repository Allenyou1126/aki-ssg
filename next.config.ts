import { config } from "@/data/site-config";
import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
	assetPrefix: isProd ? "https://blog-oss.allenyou.top/BlogNGCDN/" : "",
	output: "export",
	assetPrefix: config.optimize.cdn_prefix,
	experimental: {
		reactCompiler: true,
	},
};

export default nextConfig;
