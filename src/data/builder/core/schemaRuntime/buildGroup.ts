// src/data/builder/core/schemaRuntime/buildGroup.ts

import type { SchemaGroupMap } from "../../../data-definitions/types";
import { buildLeaf } from "./buildLeaf";
import { isLeaf } from "./types";
import type { BuildOpts } from "./types";

export function buildGroup(
    node: SchemaGroupMap,
    opts: BuildOpts,
    prefix = ""
): Record<string, unknown> {
    const out: Record<string, unknown> = {};

    for (const [key, child] of Object.entries(node)) {
        if (isLeaf(child)) {
            const leaf = buildLeaf(child, opts, prefix);
            if (Object.keys(leaf).length) out[key] = leaf;
            continue;
        }

        const nested = buildGroup(child, opts, prefix);
        if (Object.keys(nested).length) out[key] = nested;
    }

    return out;
}