import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
	assetPrefix: isProd ? "https://blog-oss.allenyou.top/BlogNGCDN/" : "",
	output: "export",
	experimental: {
		reactCompiler: true,
	},
};

export default nextConfig;
