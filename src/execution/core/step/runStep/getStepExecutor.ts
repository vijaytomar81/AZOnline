// src/execution/core/step/runStep/getStepExecutor.ts

import type { StepExecutionResult } from "@execution/core/result";
import { getExecutor } from "@execution/core/registry";
import { buildStepFailureResult } from "@execution/core/step/buildStepFailureResult";
import type { RunStepArgs } from "./types";

export function getStepExecutor(args: {
    runStepArgs: RunStepArgs;
    startedAt: string;
    debugLines: string[];
}): {
    executorFound: true;
    executor: NonNullable<ReturnType<typeof getExecutor>>;
} | {
    executorFound: false;
    result: StepExecutionResult;
} {
    const executor = getExecutor(
        args.runStepArgs.registry,
        args.runStepArgs.context,
        args.runStepArgs.step
    );

    if (!executor) {
        return {
            executorFound: false,
            result: buildStepFailureResult({
                step: args.runStepArgs.step,
                startedAt: args.startedAt,
                message: `No executor registered for step action="${args.runStepArgs.step.action}"`,
                debugLines: args.debugLines,
            }),
        };
    }

    return {
        executorFound: true,
        executor,
    };
}
