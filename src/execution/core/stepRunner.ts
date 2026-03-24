// src/execution/core/stepRunner.ts

import type { Logger } from "@utils/logger";
import { nowIso } from "@utils/time";
import type { ScenarioStep } from "@execution/modes/e2e/scenario/types";
import type { ExecutionContext } from "@execution/core/executionContext";
import { addStepResult } from "@execution/core/executionContext";
import {
    createStepExecutionResult,
    type StepExecutionResult,
} from "@execution/core/result";
import {
    getExecutor,
    type ExecutorRegistry,
} from "@execution/core/registry";
import {
    resolveStepData,
    type StepDataResolverRegistry,
} from "@execution/runtime/resolveStepData";

type ResolvedOverride = {
    testCaseId: string;
    payload: Record<string, unknown>;
    source: {
        action: string;
        sheetName: string;
    };
    sourceFileSheet: string;
};

function buildFailureResult(
    step: ScenarioStep,
    startedAt: string,
    message: string
): StepExecutionResult {
    return createStepExecutionResult({
        stepNo: step.stepNo,
        action: step.action,
        status: "failed",
        startedAt,
        finishedAt: nowIso(),
        message,
        details: {
            testCaseId: step.testCaseId,
        },
    });
}

export async function runStep(args: {
    context: ExecutionContext;
    step: ScenarioStep;
    registry: ExecutorRegistry;
    dataRegistry: StepDataResolverRegistry;
    log: Logger;
    overrideStepData?: Record<string, unknown>;
    mode?: "data" | "e2e";
}): Promise<StepExecutionResult> {
    const startedAt = nowIso();

    try {
        const executor = getExecutor(args.registry, args.context, args.step);
        if (!executor) {
            const result = buildFailureResult(
                args.step,
                startedAt,
                `No executor registered for step action="${args.step.action}"`
            );
            addStepResult(args.context, result);
            return result;
        }

        const resolved =
            args.overrideStepData
                ? ({
                    testCaseId: args.step.testCaseId,
                    payload: args.overrideStepData,
                    source: {
                        action: args.step.action,
                        sheetName: "data-mode",
                    },
                    sourceFileSheet: "data-mode",
                } as ResolvedOverride)
                : resolveStepData({
                    registry: args.dataRegistry,
                    journey: args.context.scenario.journey,
                    step: args.step,
                    log: args.log,
                });

        await executor({
            context: args.context,
            step: args.step,
            stepData: resolved.payload,
        });

        const result = createStepExecutionResult({
            stepNo: args.step.stepNo,
            action: args.step.action,
            status: "passed",
            startedAt,
            finishedAt: nowIso(),
            details: {
                testCaseId: resolved.testCaseId,
                sourceSheet: resolved.sourceFileSheet,
                sourceAction: resolved.source.action,
            },
        });

        addStepResult(args.context, result);
        return result;
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        const result = buildFailureResult(args.step, startedAt, message);
        addStepResult(args.context, result);
        return result;
    }
}