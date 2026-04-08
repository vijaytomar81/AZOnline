// src/frameworkCore/executionLayer/core/scenario/createScenarioExecutionContext.ts

import type { ExecutionContext, ExecutionScenario } from "@frameworkCore/executionLayer/contracts";
import { createExecutionContext } from "@frameworkCore/executionLayer/core/context";

export function createScenarioExecutionContext(
    scenario: ExecutionScenario
): ExecutionContext {
    return createExecutionContext(scenario);
}
