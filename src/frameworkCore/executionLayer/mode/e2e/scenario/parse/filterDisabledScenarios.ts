// src/executionLayer/mode/e2e/scenario/parse/filterDisabledScenarios.ts

import type { ExecutionScenario } from "@frameworkCore/executionLayer/contracts";

export function filterDisabledScenarios(
    scenarios: ExecutionScenario[],
    includeDisabled: boolean
): ExecutionScenario[] {
    return includeDisabled
        ? scenarios
        : scenarios.filter((scenario) => scenario.execute);
}
