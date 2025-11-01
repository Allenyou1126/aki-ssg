/** @type {import('postcss-load-config').Config} */
const config = {
	plugins: {
		"@stylexswc/postcss-plugin": {
			include: ["src/**/*.{js,jsx,ts,tsx}"],
			rsOptions: {
				aliases: {
					"@/*": ["./src/*"],
				},
				dev: process.env.NODE_ENV === "development",
			},
		},
	},
};

export default config;
