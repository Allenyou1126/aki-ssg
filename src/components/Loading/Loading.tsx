import * as stylex from "@stylexjs/stylex";

const animation = stylex.keyframes({
	"100%": {
		transform: "rotate(1turn)",
	},
});

const style = stylex.create({
	wrap: {
		alignItems: "center",
		display: "flex",
		height: "4rem",
		justifyContent: "center",
		width: "4rem",
	},
	loader: {
		animationDuration: "1s",
		animationIterationCount: "infinite",
		animationName: animation,
		animationTimingFunction: "steps(8)",
		borderRadius: "9999px",
		boxShadow:
			"calc(22px) calc(0px) 0 0, calc(15.55px) calc(15.55px) 0 1px, calc(0px) calc(22px) 0 2px, calc(-15.55px) calc(15.55px) 0 3px, calc(-22px) calc(0px) 0 4px, calc(-15.55px) calc(-15.55px) 0 5px, calc(0px) calc(-22px) 0 6px",
		color: "var(--primary)",
		height: "0.25rem",
		width: "0.25rem",
	},
});

export function Loading() {
	return (
		<div {...stylex.props(style.wrap)}>
			<div {...stylex.props(style.loader)} />
		</div>
	);
}
