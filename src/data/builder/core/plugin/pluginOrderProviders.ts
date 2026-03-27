// src/data/builder/core/plugin/pluginOrderProviders.ts

import type { PipelinePlugin } from "../pipeline";
import { DataBuilderError } from "../../errors";

export function buildProviderMap(
    plugins: PipelinePlugin[]
): Map<string, string> {
    const providers = new Map<string, string>();

    for (const plugin of plugins) {
        for (const token of plugin.provides ?? []) {
            const existing = providers.get(token);

            if (existing && existing !== plugin.name) {
                throw new DataBuilderError({
                    code: "MULTIPLE_PROVIDERS_FOR_TOKEN",
                    stage: "plugin-scan",
                    source: "pluginOrderProviders",
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