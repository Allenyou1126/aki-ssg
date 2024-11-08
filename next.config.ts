import { config } from "@/data/site-config";
import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
	output: "export",
	assetPrefix: isProd ? config.optimize.cdn_prefix : undefined,
	experimental: {
		reactCompiler: true,
		optimizeCss: true,
		optimizePackageImports: [
			"@fortawesome/free-brands-svg-icons",
			"@fortawesome/free-solid-svg-icons",
			"@fortawesome/free-regular-svg-icons",
		],
	},
};

export default nextConfig;
