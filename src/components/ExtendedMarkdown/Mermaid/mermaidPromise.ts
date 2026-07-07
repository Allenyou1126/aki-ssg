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
		console.log("[mermaidPromise] created new promise");
	} else {
		console.log("[mermaidPromise] reusing existing promise");
	}
	return g.__mermaid;
}

export function getMermaidRenderPromise(): Promise<Map<string, MermaidResult>> {
	console.log("[mermaidPromise] getMermaidRenderPromise called");
	return getOrCreateWindowMermaid().promise;
}

export function resolveMermaidPromise(results: Map<string, MermaidResult>) {
	console.log("[mermaidPromise] resolveMermaidPromise called with", results.size, "entries");
	getOrCreateWindowMermaid().resolve(results);
	console.log("[mermaidPromise] promise resolved");
}
