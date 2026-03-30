// src/executionLayer/mode/e2e/filterScenarios.ts

import type { ExecutionScenario } from "@executionLayer/contracts";

export function filterScenarios(
    scenarios: ExecutionScenario[],
    selectedIds: string[]
): ExecutionScenario[] {
    if (!selectedIds.length) {
        return scenarios;
    }

    const wanted = new Set(selectedIds);
    return scenarios.filter((scenario) => wanted.has(scenario.scenarioId));
}
