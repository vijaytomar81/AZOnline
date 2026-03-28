// src/execution/core/case/runCases/getScenarioScope.ts

import type { ExecutionScenario } from "@execution/modes/e2e/scenario/types";

export function getScenarioScope(
    scenario: ExecutionScenario
): string {
    return `execution:${scenario.scenarioId}`;
}
