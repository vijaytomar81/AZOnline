// src/dataLayer/builder/core/schemaRuntime/attachAdditionalDriverChildren.ts

import type { DataSchema } from "../../../data-definitions/types";
import type { BuildOpts } from "./types";
import { buildRepeat } from "./buildRepeat";

export function attachAdditionalDriverChildren(
    additionalDrivers: Record<string, unknown>,
    schema: DataSchema,
    opts: BuildOpts
): void {
    const claimTemplate = schema.repeatedGroups?.additionalDriverClaims;
    const convictionTemplate =
        schema.repeatedGroups?.additionalDriverConvictions;

    for (const [driverKey, driverValue] of Object.entries(additionalDrivers)) {
        if (
            !driverKey.startsWith("driver") ||
            !driverValue ||
            typeof driverValue !== "object"
        ) {
            continue;
        }

        const driverIndex = driverKey.replace("driver", "");
        const driverPrefix = `AD${driverIndex}`;

        const driverObj = driverValue as Record<string, unknown>;

        if (claimTemplate) {
            driverObj.claims = buildRepeat(
                claimTemplate,
                opts,
                "claim",
                driverPrefix
            );
        }

        if (convictionTemplate) {
            driverObj.convictions = buildRepeat(
                convictionTemplate,
                opts,
                "conviction",
                driverPrefix
            );
        }
    }
}