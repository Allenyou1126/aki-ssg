export type MermaidResult =
    | { succeed: true; res: string; resDark: string }
    | { succeed: false; error: unknown };

interface WindowMermaid {
    promise: Promise<Map<string, MermaidResult>>;
    resolve: (value: Map<string, MermaidResult>) => void;
}

function getOrCreateWindowMermaid(): WindowMermaid {
	const g = globalThis as typeof globalThis & {
		__mermaid?: WindowMermaid;
	};
	if (!g.__mermaid) {
		let _resolve!: (value: Map<string, MermaidResult>) => void;
		const promise = new Promise<Map<string, MermaidResult>>((resolve) => {
			_resolve = resolve;
		});
		g.__mermaid = { promise, resolve: _resolve };
	}
	return g.__mermaid;
}

export function getMermaidRenderPromise(): Promise<Map<string, MermaidResult>> {
    return getOrCreateWindowMermaid().promise;
}

export function resolveMermaidPromise(results: Map<string, MermaidResult>) {
    getOrCreateWindowMermaid().resolve(results);
}
