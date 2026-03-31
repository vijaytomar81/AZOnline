// src/dataLayer/builder/core/plugin/pluginOrder.ts

import type { PipelinePlugin } from "../pipeline";
import { DataBuilderError } from "../../errors";
import { buildDependencyGraph } from "./pluginOrderDependencies";
import { buildProviderMap } from "./pluginOrderProviders";
import { sortAvailablePlugins } from "./pluginOrderSort";

export function resolvePluginRunOrder(
    plugins: PipelinePlugin[]
): PipelinePlugin[] {
    const providers = buildProviderMap(plugins);
    const { deps, out, byName } = buildDependencyGraph({
        plugins,
        providers,
    });

    const indeg = new Map<string, number>();
    for (const [name, incoming] of deps.entries()) {
        indeg.set(name, incoming.size);
    }

    const available: string[] = [];
    for (const [name, degree] of indeg.entries()) {
        if (degree === 0) {
            available.push(name);
        }
    }

    const result: string[] = [];

    while (available.length > 0) {
        sortAvailablePlugins(available, byName);

        const current = available.shift();
        if (!current) {
            break;
        }

        result.push(current);

        for (const next of out.get(current) ?? []) {
            const newDegree = (indeg.get(next) ?? 0) - 1;
            indeg.set(next, newDegree);

            if (newDegree === 0) {
                available.push(next);
            }
        }
    }

    if (result.length !== plugins.length) {
        const remaining = plugins
            .map((plugin) => plugin.name)
            .filter((name) => !result.includes(name));

        throw new DataBuilderError({
            code: "PLUGIN_CYCLE_DETECTED",
            stage: "plugin-scan",
            source: "pluginOrder",
            message: `Cycle detected among: ${remaining.join(" -> ")}`,
            context: {
                remainingPlugins: remaining.join(" -> "),
            },
        });
    }

    return result.map((name) => byName.get(name) as PipelinePlugin);
}