// src/data/builder/core/graph.ts
import type { PipelinePlugin } from "./pipeline";

type GraphIssue =
    | { type: "DUPLICATE_PLUGIN_NAME"; name: string }
    | { type: "CYCLE"; cycle: string[] };

export function resolvePluginOrder(plugins: PipelinePlugin[]): { ordered: PipelinePlugin[] } {
    // 1) Ensure unique plugin names
    const seen = new Set<string>();
    const issues: GraphIssue[] = [];
    for (const p of plugins) {
        if (seen.has(p.name)) issues.push({ type: "DUPLICATE_PLUGIN_NAME", name: p.name });
        seen.add(p.name);
    }
    if (issues.length) throwGraphError(issues);

    // 2) Map: dataKey -> plugin names providing it
    const providersByKey = new Map<string, string[]>();
    for (const p of plugins) {
        for (const k of p.provides ?? []) {
            const arr = providersByKey.get(k) ?? [];
            arr.push(p.name);
            providersByKey.set(k, arr);
        }
    }

    // 3) Build edges provider -> consumer
    const edges = new Map<string, Set<string>>();
    const indeg = new Map<string, number>();

    for (const p of plugins) {
        edges.set(p.name, new Set());
        indeg.set(p.name, 0);
    }

    for (const consumer of plugins) {
        for (const req of consumer.requires ?? []) {
            // "external:" means ctx provides it initially, no edge needed
            if (req.startsWith("external:")) continue;

            // If multiple providers exist, depend on all of them (safe default)
            const providers = providersByKey.get(req) ?? [];
            for (const providerName of providers) {
                if (providerName === consumer.name) continue;
                const out = edges.get(providerName)!;
                if (!out.has(consumer.name)) {
                    out.add(consumer.name);
                    indeg.set(consumer.name, (indeg.get(consumer.name) ?? 0) + 1);
                }
            }
        }
    }

    // 4) Topological sort (Kahn)
    const queue: string[] = [];
    for (const [name, d] of indeg.entries()) {
        if (d === 0) queue.push(name);
    }

    const orderedNames: string[] = [];
    while (queue.length) {
        queue.sort(); // deterministic order
        const n = queue.shift()!;
        orderedNames.push(n);

        for (const to of edges.get(n) ?? []) {
            indeg.set(to, (indeg.get(to) ?? 0) - 1);
            if (indeg.get(to) === 0) queue.push(to);
        }
    }

    if (orderedNames.length !== plugins.length) {
        const remaining = [...indeg.entries()].filter(([, d]) => (d ?? 0) > 0).map(([n]) => n);
        throwGraphError([{ type: "CYCLE", cycle: remaining }]);
    }

    const byName = new Map(plugins.map((p) => [p.name, p] as const));
    return { ordered: orderedNames.map((n) => byName.get(n)!) };
}

function throwGraphError(issues: GraphIssue[]): never {
    const lines: string[] = ["Plugin graph error(s):"];
    for (const i of issues) {
        if (i.type === "DUPLICATE_PLUGIN_NAME") {
            lines.push(`- Duplicate plugin name: "${i.name}"`);
        }
        if (i.type === "CYCLE") {
            lines.push(`- Cycle detected among: ${i.cycle.join(" -> ")}`);
        }
    }
    throw new Error(lines.join("\n"));
}