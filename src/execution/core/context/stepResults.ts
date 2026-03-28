// src/execution/core/context/stepResults.ts

import type { StepExecutionResult } from "@execution/core/result";
import type { ExecutionContext } from "./executionContext.types";

export function addStepResult(
    context: ExecutionContext,
    result: StepExecutionResult
): void {
    context.stepResults.push(result);
}
