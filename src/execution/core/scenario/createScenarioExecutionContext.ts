// src/execution/core/scenario/createScenarioExecutionContext.ts

import type { ExecutionScenario } from "@execution/modes/e2e/scenario/types";
import { createExecutionContext } from "@execution/core/executionContext";

export function createScenarioExecutionContext(
    scenario: ExecutionScenario
) {
    return createExecutionContext(scenario);
}
