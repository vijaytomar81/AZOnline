// src/frameworkCore/executionLayer/core/scenario/createScenarioExecutionContext.ts

import { createExecutionContext } from "@frameworkCore/executionLayer/core/context";
import type { ExecutionScenario } from "@frameworkCore/executionLayer/contracts";
import type { EnvKey } from "@configLayer/environments";

export function createScenarioExecutionContext(
    scenario: ExecutionScenario,
    environment: EnvKey
) {
    return createExecutionContext(scenario, environment);
}
