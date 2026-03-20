// src/execution/runtime/stepRunner.ts

import { nowIso } from "../../utils/time";
import type { Logger } from "../../utils/logger";
import type { ScenarioStep } from "../scenario/types";
import type { ExecutionContext } from "../runtime/executionContext";
import { addStepResult } from "../runtime/executionContext";
import {
    createStepExecutionResult,
    type StepExecutionResult,
} from "../runtime/result";
import {
    getExecutor,
    type ExecutorRegistry,
} from "../runtime/registry";
import {
    resolveStepData,
    type StepDataResolverRegistry,
} from "../runtime/resolveStepData";

export type RunStepArgs = {
    context: ExecutionContext;
    step: ScenarioStep;
    registry: ExecutorRegistry;
    dataRegistry: StepDataResolverRegistry;
    log: Logger;
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
    });
}

export async function runStep(args: RunStepArgs): Promise<StepExecutionResult> {
    const { context, step, registry, dataRegistry, log } = args;
    const startedAt = nowIso();

    try {
        const executor = getExecutor(registry, context, step);
        if (!executor) {
            const result = buildFailureResult(
                step,
                startedAt,
                `No executor registered for step action="${step.action}"`
            );
            addStepResult(context, result);
            return result;
        }

        const resolved = resolveStepData({
            registry: dataRegistry,
            journey: context.scenario.journey,
            step,
        });

        await executor({
            context,
            step,
            stepData: resolved.payload,
        });

        const result = createStepExecutionResult({
            stepNo: step.stepNo,
            action: step.action,
            status: "passed",
            startedAt,
            finishedAt: nowIso(),
            details: {
                testCaseId: resolved.testCaseId,
                sourceSheet: resolved.sourceFileSheet,
                sourceAction: resolved.source.action,
            },
        });

        addStepResult(context, result);
        return result;
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        log.error(`Step${step.stepNo} failed: ${message}`);

        const result = buildFailureResult(step, startedAt, message);
        addStepResult(context, result);
        return result;
    }
}