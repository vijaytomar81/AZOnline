// src/dataLayer/builder/core/plugin/pluginOrderDependencies.ts

import type { PipelinePlugin } from "../pipeline";
import { DataBuilderError } from "../../errors";

export type PluginDependencyGraph = {
    deps: Map<string, Set<string>>;
    out: Map<string, Set<string>>;
    byName: Map<string, PipelinePlugin>;
};

function isExternal(req: string): boolean {
    return req.startsWith("external:");
}

export function buildDependencyGraph(args: {
    plugins: PipelinePlugin[];
    providers: Map<string, string>;
}): PluginDependencyGraph {
    const { plugins, providers } = args;
    const deps = new Map<string, Set<string>>();
    const out = new Map<string, Set<string>>();
    const byName = new Map<string, PipelinePlugin>();

    for (const plugin of plugins) {
        byName.set(plugin.name, plugin);
        deps.set(plugin.name, new Set());
        out.set(plugin.name, new Set());
    }

    for (const plugin of plugins) {
        for (const req of plugin.requires ?? []) {
            if (isExternal(req)) {
                continue;
            }

            const providerName = providers.get(req);

            if (!providerName) {
                throw new DataBuilderError({
                    code: "PROVIDER_NOT_FOUND",
                    stage: "plugin-scan",
                    source: "pluginOrderDependencies",
                    message: `No provider found for required token "${req}" required by "${plugin.name}"`,
                    context: {
                        requiredToken: req,
                        consumerPlugin: plugin.name,
                    },
                });
            }

            if (providerName === plugin.name) {
                continue;
            }

            deps.get(plugin.name)?.add(providerName);
            out.get(providerName)?.add(plugin.name);
        }
    }

    return { deps, out, byName };
}