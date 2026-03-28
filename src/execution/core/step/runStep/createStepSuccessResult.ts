// src/execution/core/step/runStep/createStepSuccessResult.ts

import { nowIso } from "@utils/time";
import {
    createStepExecutionResult,
    type StepExecutionResult,
} from "@execution/core/result";
import type { ScenarioStep } from "@execution/modes/e2e/scenario/types";
import type { ResolvedStepExecutionData } from "@execution/core/step/buildOverrideResolved";

export function createStepSuccessResult(args: {
    step: ScenarioStep;
    startedAt: string;
    resolved: ResolvedStepExecutionData;
    debugLines: string[];
}): StepExecutionResult {
    return createStepExecutionResult({
        stepNo: args.step.stepNo,
        action: args.step.action,
        status: "passed",
        startedAt: args.startedAt,
        finishedAt: nowIso(),
        details: {
            testCaseId: args.resolved.testCaseId,
            sourceSheet: args.resolved.sourceFileSheet,
            sourceAction: args.resolved.source.action,
            debugLines: args.debugLines,
        },
    });
}
