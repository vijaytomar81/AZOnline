// src/frameworkCore/executionLayer/core/runner/getScenarioScope.ts

import type { ExecutionScenario } from "@frameworkCore/executionLayer/contracts";

export function getScenarioScope(
    scenario: ExecutionScenario
): string {
    return `execution:${scenario.scenarioId}`;
}
