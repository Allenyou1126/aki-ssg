export type MermaidResult =
	| { succeed: true; res: string; resDark: string }
	| { succeed: false; error: unknown };

let _resolve: ((value: Map<string, MermaidResult>) => void) | null = null;

export const mermaidRenderPromise: Promise<Map<string, MermaidResult>> =
	new Promise((resolve) => {
		_resolve = resolve;
	});

export function resolveMermaidPromise(results: Map<string, MermaidResult>) {
	_resolve?.(results);
}
