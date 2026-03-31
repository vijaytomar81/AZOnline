// src/dataLayer/builder/core/schemaRuntime/buildLeaf.ts

import { readValue } from "./readValue";
import type { BuildOpts } from "./types";

export function buildLeaf(
    mapping: Record<string, string>,
    opts: BuildOpts,
    prefix: string
): Record<string, unknown> {
    const out: Record<string, unknown> = {};

    for (const [jsonKey, excelField] of Object.entries(mapping)) {
        const value = readValue(opts, excelField, prefix);

        if (!opts.includeEmpty && value === "") continue;

        out[jsonKey] = value;
    }

    return out;
}