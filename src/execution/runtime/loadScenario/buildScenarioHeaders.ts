// src/execution/runtime/loadScenario/buildScenarioHeaders.ts

import type { LoadedWorksheet } from "@execution/runtime/scenarioSheet/workbook/types";
import { buildCanonicalHeaders } from "@execution/runtime/scenarioSheet/headers/buildCanonicalHeaders";
import { getHeaders } from "@execution/runtime/scenarioSheet/headers/getHeaders";
import { validateScenarioHeaders } from "@execution/runtime/scenarioSheet/headers/validateScenarioHeaders";

export function buildScenarioHeaders(loaded: LoadedWorksheet): string[] {
    const rawHeaders = getHeaders(loaded.worksheet);
    validateScenarioHeaders(rawHeaders);

    const canonicalHeaders = buildCanonicalHeaders();

    return rawHeaders.map((header) => canonicalHeaders.get(header) ?? header);
}
