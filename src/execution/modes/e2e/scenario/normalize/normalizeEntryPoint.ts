// src/execution/modes/e2e/scenario/normalize/normalizeEntryPoint.ts

import type { RawScenarioRow, ScenarioEntryPoint } from "../types";
import { normalizePolicyContext } from "./normalizePolicyContext";
import { normalizeScenarioKey } from "./shared";

export function normalizeEntryPoint(
    row: RawScenarioRow
): ScenarioEntryPoint | undefined {
    const policyContext = normalizePolicyContext(row.PolicyContext);

    if (policyContext === "ExistingPolicy") {
        return undefined;
    }

    const journey = normalizeScenarioKey(row.Journey);
    const entryPoint = normalizeScenarioKey(row.EntryPoint);

    if (journey === "direct" && !entryPoint) {
        return "Direct";
    }

    if (entryPoint === "pcw") return "PCW";
    if (entryPoint === "pcwtool") return "PCWTool";

    return "Direct";
}
