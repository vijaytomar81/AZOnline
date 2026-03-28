// src/execution/modes/e2e/scenario/parse/hasValidationErrors.ts

import type { ScenarioValidationResult } from "../types";

export function hasValidationErrors(
    items: ScenarioValidationResult[]
): boolean {
    return items.some((item) => item.errors.length > 0);
}
