import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import stylexPlugin from "@stylexjs/eslint-plugin";

export default defineConfig([
	globalIgnores([".next/*", "node_modules/*", "out/*"]),
	...nextVitals,
	...nextTs,
	{
		files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
		plugins: {
			"@stylexjs": stylexPlugin,
		},
		rules: {
			"@stylexjs/no-legacy-contextual-styles": "error",
			"@stylexjs/no-lookahead-selectors": "error",
			"@stylexjs/no-nonstandard-styles": "error",
			"@stylexjs/enforce-extension": "error",
			"@stylexjs/valid-shorthands": "error",
			"@stylexjs/valid-styles": "error",
			"@stylexjs/no-unused": "error",
			"@stylexjs/sort-keys": "error",
		},
	},
]);
