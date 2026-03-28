// src/execution/core/scenario/buildScenarioExecutionResult.ts

import type { ExecutionContext } from "@execution/core/context/executionContext.types";
import {
    buildScenarioExecutionResult,
    type ScenarioExecutionResult,
} from "@execution/core/result";

export function buildScenarioResultFromContext(
    context: ExecutionContext
): ScenarioExecutionResult {
    return buildScenarioExecutionResult({
        scenarioId: context.scenario.scenarioId,
        stepResults: context.stepResults,
        outputs: context.outputs,
    });
}
