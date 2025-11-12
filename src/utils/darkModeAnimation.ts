import { flushSync } from "react-dom";

export async function darkModeAnimation(
	x: number,
	y: number,
	execute: () => void
) {
	if (!document.startViewTransition) {
		execute();
		return;
	}
	const radius = Math.hypot(
		Math.max(x, window.innerWidth - x),
		Math.max(y, window.innerHeight - y)
	);
	const vt = document.startViewTransition(() => {
		flushSync(() => {
			execute();
		});
	});
	await vt.ready.catch(() => {});
	const frameConfig = {
		clipPath: [
			`circle(0 at ${x}px ${y}px)`,
			`circle(${radius}px at ${x}px ${y}px)`,
		],
	};
	const timingConfig = {
		duration: 400,
		pseudoElement: "::view-transition-new(root)",
	};
	document.documentElement.animate(frameConfig, timingConfig);
}
