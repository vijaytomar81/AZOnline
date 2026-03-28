// src/execution/core/step/runStep/runStep.ts

import { nowIso } from "@utils/time";
import { LOG_CATEGORIES } from "@logging/core/logCategories";
import { LOG_LEVELS } from "@logging/core/logLevels";
import { emitLog } from "@logging/emitLog";
import { addStepResult } from "@execution/core/context/stepResults";
import type { StepExecutionResult } from "@execution/core/result";
import { buildStepFailureResult } from "@execution/core/step/buildStepFailureResult";
import { createStepDebugCollector } from "@execution/core/step/createStepDebugCollector";
import { resolveStepExecutionData } from "@execution/core/step/resolveStepExecutionData";
import { createStepSuccessResult } from "./createStepSuccessResult";
import { getStepExecutor } from "./getStepExecutor";
import type { RunStepArgs } from "./types";

async function executeStep(args: {
    runStepArgs: RunStepArgs;
    startedAt: string;
}): Promise<StepExecutionResult> {
    const debug = createStepDebugCollector();

    emitLog({
        scope: args.runStepArgs.logScope,
        level: LOG_LEVELS.DEBUG,
        category: LOG_CATEGORIES.TECHNICAL,
        message: `Step started -> action=${args.runStepArgs.step.action}, testCaseId=${args.runStepArgs.step.testCaseId}`,
    });

    const executorLookup = getStepExecutor({
        runStepArgs: args.runStepArgs,
        startedAt: args.startedAt,
        debugLines: debug.all(),
    });

    if (!executorLookup.executorFound) {
        return executorLookup.result;
    }

    const resolved = resolveStepExecutionData({
        context: args.runStepArgs.context,
        step: args.runStepArgs.step,
        dataRegistry: args.runStepArgs.dataRegistry,
        logScope: args.runStepArgs.logScope,
        debugCollector: debug,
        overrideStepData: args.runStepArgs.overrideStepData,
    });

    await executorLookup.executor({
        context: args.runStepArgs.context,
        step: args.runStepArgs.step,
        stepData: resolved.payload,
    });

    return createStepSuccessResult({
        step: args.runStepArgs.step,
        startedAt: args.startedAt,
        resolved,
        debugLines: debug.all(),
    });
}

export async function runStep(args: RunStepArgs): Promise<StepExecutionResult> {
    const startedAt = nowIso();

    try {
        const result = await executeStep({
            runStepArgs: args,
            startedAt,
        });

        addStepResult(args.context, result);
        return result;
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);

        const result = buildStepFailureResult({
            step: args.step,
            startedAt,
            message,
            debugLines: [],
        });

        addStepResult(args.context, result);
        return result;
    }
}
