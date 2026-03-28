// src/execution/modes/e2e/scenario/parse/filterDisabledScenarios.ts

import type { ExecutionScenario } from "../types";

export function filterDisabledScenarios(
    scenarios: ExecutionScenario[],
    includeDisabled: boolean
): ExecutionScenario[] {
    return includeDisabled
        ? scenarios
        : scenarios.filter((item) => item.execute);
}
