// src/frameworkCore/executionLayer/core/scenario/buildScenarioExecutionResult.ts

import type {
    ExecutionContext,
    ExecutionScenarioResult,
} from "@frameworkCore/executionLayer/contracts";
import { buildExecutionScenarioResult } from "@frameworkCore/executionLayer/core/result";

export function buildScenarioExecutionResult(
    context: ExecutionContext
): ExecutionScenarioResult & {
    browser?: unknown;
} {
    const base = buildExecutionScenarioResult({
        scenarioId: context.scenario.scenarioId,
        itemResults: context.itemResults,
        outputs: context.outputs,
    });

    return {
        ...base,
        browser: context.browserInfo,
    };
}