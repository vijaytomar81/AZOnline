// src/execution/modes/e2e/core/filterScenarios.ts

import type { ExecutionScenario } from "@execution/modes/e2e/scenario/types";

export function filterScenarios(
    scenarios: ExecutionScenario[],
    selectedIds: string[]
): ExecutionScenario[] {
    if (!selectedIds.length) {
        return scenarios;
    }

    const wanted = new Set(selectedIds);
    return scenarios.filter((item) => wanted.has(item.scenarioId));
}
