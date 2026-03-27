// src/data/builder/core/schemaRuntime/buildRepeat.ts

import type { RepeatedGroup } from "../../../data-definitions/types";
import { readValue } from "./readValue";
import { buildGroup } from "./buildGroup";
import type { BuildOpts } from "./types";

export function buildRepeat(
    rep: RepeatedGroup,
    opts: BuildOpts,
    itemKeyPrefix: string,
    outerPrefix = ""
): Record<string, unknown> {
    const count = Number(readValue(opts, rep.countField, outerPrefix) || 0);

    const safeCount = Number.isFinite(count)
        ? Math.max(0, Math.min(count, rep.max))
        : 0;

    const out: Record<string, unknown> = { count: safeCount };

    for (let i = 1; i <= safeCount; i++) {
        const itemPrefix = `${outerPrefix}${rep.prefixBase}${i}`;

        out[`${itemKeyPrefix}${i}`] = buildGroup(
            rep.groups,
            opts,
            itemPrefix
        );
    }

    return out;
}