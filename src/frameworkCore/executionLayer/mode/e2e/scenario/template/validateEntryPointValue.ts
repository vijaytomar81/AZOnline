// src/executionLayer/mode/e2e/scenario/template/validateEntryPointValue.ts

import type { RawExecutionScenarioRow } from "../types";
import {
    getTemplateString,
    isDirectJourney,
    isExistingPolicy,
    isNewBusiness,
    normalizeTemplateKey,
} from "./shared";

export function validateEntryPointValue(
    row: RawExecutionScenarioRow
): string[] {
    const entryPoint = normalizeTemplateKey(row.EntryPoint);
    const journey = normalizeTemplateKey(row.Journey);

    if (isExistingPolicy(row)) {
        return [];
    }

    if (!isNewBusiness(row)) {
        return [`Invalid PolicyContext value: ${getTemplateString(row, "PolicyContext")}`];
    }

    if (journey === "direct") {
        if (!entryPoint || entryPoint === "direct") {
            return [];
        }

        return ["EntryPoint must be blank or Direct when Journey is Direct"];
    }

    if (!entryPoint) {
        return ["EntryPoint is required when Journey is not Direct for NewBusiness"];
    }

    if (entryPoint !== "pcw" && entryPoint !== "pcwtool") {
        return ["EntryPoint must be PCW or PCWTool when Journey is not Direct"];
    }

    return [];
}
