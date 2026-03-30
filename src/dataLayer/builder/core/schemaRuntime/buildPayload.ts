// src/dataLayer/builder/core/schemaRuntime/buildPayload.ts

import type { DataSchema } from "../../../data-definitions/types";
import type { BuildOpts } from "./types";
import { buildGroup } from "./buildGroup";
import { buildRepeat } from "./buildRepeat";
import { attachAdditionalDriverChildren } from "./attachAdditionalDriverChildren";

export function buildPayload(
    schema: DataSchema,
    opts: BuildOpts
): Record<string, unknown> {
    const payload = buildGroup(schema.groups, opts);
    const reps = schema.repeatedGroups ?? {};

    if (reps.policyHolderClaims) {
        payload.policyHolderClaims = buildRepeat(
            reps.policyHolderClaims,
            opts,
            "claim"
        );
    }

    if (reps.policyHolderConvictions) {
        payload.policyHolderConvictions = buildRepeat(
            reps.policyHolderConvictions,
            opts,
            "conviction"
        );
    }

    if (reps.additionalDrivers) {
        payload.additionalDrivers = buildRepeat(
            reps.additionalDrivers,
            opts,
            "driver"
        );

        attachAdditionalDriverChildren(
            payload.additionalDrivers as Record<string, unknown>,
            schema,
            opts
        );
    }

    return payload;
}