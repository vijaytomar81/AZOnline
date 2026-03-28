// src/execution/core/step/buildStepFailureResult.ts

import { nowIso } from "@utils/time";
import type { ScenarioStep } from "@execution/modes/e2e/scenario/types";
import {
    createStepExecutionResult,
    type StepExecutionResult,
} from "@execution/core/result";

export function buildStepFailureResult(args: {
    step: ScenarioStep;
    startedAt: string;
    message: string;
    debugLines?: string[];
}): StepExecutionResult {
    return createStepExecutionResult({
        stepNo: args.step.stepNo,
        action: args.step.action,
        status: "failed",
        startedAt: args.startedAt,
        finishedAt: nowIso(),
        message: args.message,
        details: {
            testCaseId: args.step.testCaseId,
            debugLines: args.debugLines ?? [],
        },
    });
}
