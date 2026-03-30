// src/executionLayer/core/scenario/buildScenarioExecutionResult.ts

import type { ExecutionContext, ExecutionScenarioResult } from "@executionLayer/contracts";
import { buildExecutionScenarioResult } from "@executionLayer/core/result";

export function buildScenarioExecutionResult(
    context: ExecutionContext
): ExecutionScenarioResult {
    return buildExecutionScenarioResult({
        scenarioId: context.scenario.scenarioId,
        itemResults: context.itemResults,
        outputs: context.outputs,
    });
}
