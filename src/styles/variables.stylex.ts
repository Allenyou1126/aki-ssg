import * as stylex from "@stylexjs/stylex";

export const themeTokens = stylex.defineVars({
	primaryColor: stylex.types.color("#66ccff"),
	backgroundImage:
		"linear-gradient(to bottom, var(--bg) 0%, var(--bg-dark) 100%)",
	backgroundImageDark:
		"linear-gradient(to bottom, var(--bg) 0%, var(--bg-dark) 100%)",
});
