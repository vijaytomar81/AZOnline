// src/executionLayer/core/scenario/createScenarioExecutionContext.ts

import type { ExecutionContext, ExecutionScenario } from "@executionLayer/contracts";
import { createExecutionContext } from "@executionLayer/core/context";

export function createScenarioExecutionContext(
    scenario: ExecutionScenario
): ExecutionContext {
    return createExecutionContext(scenario);
}
