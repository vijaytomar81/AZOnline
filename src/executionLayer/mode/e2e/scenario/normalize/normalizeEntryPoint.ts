// src/executionLayer/mode/e2e/scenario/normalize/normalizeEntryPoint.ts

import type { ExecutionEntryPoint } from "@executionLayer/contracts";
import type { RawExecutionScenarioRow } from "../types";
import { normalizePolicyContext } from "./normalizePolicyContext";
import { normalizeKey } from "./shared";

export function normalizeEntryPoint(
    row: RawExecutionScenarioRow
): ExecutionEntryPoint | undefined {
    const policyContext = normalizePolicyContext(row.PolicyContext);

    if (policyContext === "ExistingPolicy") {
        return undefined;
    }

    const journey = normalizeKey(row.Journey);
    const entryPoint = normalizeKey(row.EntryPoint);

    if (journey === "direct" && !entryPoint) {
        return "Direct";
    }

    if (entryPoint === "pcw") {
        return "PCW";
    }

    if (entryPoint === "pcwtool") {
        return "PCWTool";
    }

    return "Direct";
}
