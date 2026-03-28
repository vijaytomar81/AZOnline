// src/execution/runtime/scenarioSheet/rows/isEmptyScenarioRow.ts

import { normalizeSpaces } from "@utils/text";

export function isEmptyScenarioRow(values: string[]): boolean {
    return values.every((value) => !normalizeSpaces(value));
}
