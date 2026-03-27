// src/data/builder/core/plugin/pluginOrderSort.ts

import type { PipelinePlugin } from "../pipeline";

export function sortAvailablePlugins(
    available: string[],
    byName: Map<string, PipelinePlugin>
): void {
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
}