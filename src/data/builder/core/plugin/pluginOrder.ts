// src/data/builder/core/plugin/pluginOrder.ts

import type { PipelinePlugin } from "../pipeline";
import { DataBuilderError } from "../../errors";

function isExternal(req: string): boolean {
    return req.startsWith("external:");
}

function buildProviderMap(plugins: PipelinePlugin[]): Map<string, string> {
    const providers = new Map<string, string>();

    for (const plugin of plugins) {
        for (const token of plugin.provides ?? []) {
            const existing = providers.get(token);

            if (existing && existing !== plugin.name) {
                throw new DataBuilderError({
                    code: "MULTIPLE_PROVIDERS_FOR_TOKEN",
                    stage: "plugin-scan",
                    source: "pluginOrder",
                    message: `Multiple providers for token "${token}": ${existing}, ${plugin.name}`,
                    context: {
                        token,
                        existingProvider: existing,
                        newProvider: plugin.name,
                    },
                });
            }

            providers.set(token, plugin.name);
        }
    }

    return providers;
}

export function resolvePluginRunOrder(
    plugins: PipelinePlugin[]
): PipelinePlugin[] {
    const providers = buildProviderMap(plugins);
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
                    source: "pluginOrder",
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
        available.sort((a, b) => {
            const pluginA = byName.get(a);
            const pluginB = byName.get(b);

            if (!pluginA || !pluginB) {
                return a.localeCompare(b);
            }

            const orderA = pluginA.order ?? 0;
            const orderB = pluginB.order ?? 0;

            if (orderA !== orderB) {
                return orderA - orderB;
            }

            return a.localeCompare(b);
        });

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