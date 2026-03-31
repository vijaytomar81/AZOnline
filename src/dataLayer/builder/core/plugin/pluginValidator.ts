// src/dataLayer/builder/core/plugin/pluginValidator.ts

import type { PipelinePlugin } from "../pipeline";
import type { DiscoveredPlugin } from "./pluginDiscovery";
import { DataBuilderError } from "../../errors";

export function isPipelinePlugin(value: unknown): value is PipelinePlugin {
    return (
        !!value &&
        typeof value === "object" &&
        typeof (value as PipelinePlugin).name === "string" &&
        typeof (value as PipelinePlugin).run === "function"
    );
}

export function pickPluginExport(mod: unknown): PipelinePlugin | null {
    const record = (mod as Record<string, unknown> | null) ?? {};
    const candidateDefault = record.default;

    if (isPipelinePlugin(candidateDefault)) {
        return candidateDefault;
    }

    for (const key of Object.keys(record)) {
        const value = record[key];
        if (isPipelinePlugin(value)) {
            return value;
        }
    }

    return null;
}

export function validateDuplicatePluginNames(
    discovered: DiscoveredPlugin[]
): void {
    const names = discovered.map((item) => item.plugin.name);
    const duplicates = names.filter((name, index) => names.indexOf(name) !== index);

    if (!duplicates.length) {
        return;
    }

    const uniqueDuplicates = Array.from(new Set(duplicates));

    throw new DataBuilderError({
        code: "DUPLICATE_PLUGIN_NAMES",
        stage: "plugin-scan",
        source: "pluginValidator",
        message: `Duplicate plugin name(s): ${uniqueDuplicates.join(", ")}`,
        context: {
            duplicateNames: uniqueDuplicates.join(", "),
        },
    });
}