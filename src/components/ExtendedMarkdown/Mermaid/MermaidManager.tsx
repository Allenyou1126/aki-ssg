import MermaidManagerClient from "./MermaidManagerClient";
import type { MermaidSource } from "./mermaidRender";

export default function MermaidManager({
	sources,
	children,
}: {
	sources: MermaidSource[];
	children: React.ReactNode;
}) {
	if (sources.length === 0) {
		return <>{children}</>;
	}

	return (
		<MermaidManagerClient sources={sources}>
			{children}
		</MermaidManagerClient>
	);
}
