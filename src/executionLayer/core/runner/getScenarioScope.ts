// src/executionLayer/core/runner/getScenarioScope.ts

import type { ExecutionScenario } from "@executionLayer/contracts";

export function getScenarioScope(
    scenario: ExecutionScenario
): string {
    return `execution:${scenario.scenarioId}`;
}
