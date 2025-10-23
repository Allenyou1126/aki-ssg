import { config } from "@/data/site-config";
import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
	output: "export",
	assetPrefix: isProd ? config.optimize.cdn_prefix : undefined,
	reactCompiler: true,
	experimental: {
		optimizeCss: true,
		turbopackFileSystemCacheForDev: true,
		turbopackFileSystemCacheForBuild: true,
	},
};

export default nextConfig;
