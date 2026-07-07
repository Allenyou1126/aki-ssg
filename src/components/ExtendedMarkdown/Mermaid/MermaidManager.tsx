import type { MermaidSource } from "./mermaidRender";

export default async function MermaidManager({
    sources,
    children,
}: {
    sources: MermaidSource[];
    children: React.ReactNode;
}) {
    if (sources.length === 0) {
        return <>{children}</>;
    }

    const { default: MermaidManagerClient } =
        await import("./MermaidManagerClient");

    return (
        <MermaidManagerClient sources={sources}>
            {children}
        </MermaidManagerClient>
    );
}
