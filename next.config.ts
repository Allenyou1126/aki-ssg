import { config } from "@/data/site-config";
import type { NextConfig } from "next";
import withStyleXBuilder from "@stylexswc/nextjs-plugin/turbopack";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
    output: "export",
    assetPrefix: isProd ? config.optimize.cdn_prefix : undefined,
    reactCompiler: true,
    experimental: {
        optimizeCss: true,
        turbopackFileSystemCacheForDev: true,
    },
};

const withStylex = withStyleXBuilder({
    rsOptions: {
        dev: !isProd,
        aliases: {
            "@/*": ["./src/*"],
        },
    },
});

export default withStylex(nextConfig);
