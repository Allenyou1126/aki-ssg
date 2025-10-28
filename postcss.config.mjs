/** @type {import('postcss-load-config').Config} */
const config = {
	plugins: {
		"@stylexswc/postcss-plugin": {
			include: ["src/**/*.{js,jsx,ts,tsx}"],
			rsOptions: {
				dev: process.env.NODE_ENV === "development",
			},
		},
	},
};

export default config;
