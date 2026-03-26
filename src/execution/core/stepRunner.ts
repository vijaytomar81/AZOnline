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

function createStepDebugCollector() {
    const debugLines: string[] = [];

    return {
        push(message: string): void {
            const text = String(message ?? "").trim();
            if (text) {
                debugLines.push(text);
            }
        },
        all(): string[] {
            return debugLines;
        },
    };
}

function buildFailureResult(args: {
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
    const debug = createStepDebugCollector();

    try {
        const executor = getExecutor(args.registry, args.context, args.step);

        if (!executor) {
            const result = buildFailureResult({
                step: args.step,
                startedAt,
                message: `No executor registered for step action="${args.step.action}"`,
                debugLines: debug.all(),
            });
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
                    debugCollector: debug,
                });

        if (args.overrideStepData) {
            debug.push(
                `Using override step data -> action=${args.step.action}, testCaseId=${args.step.testCaseId}`
            );
            debug.push(`Resolved source -> sheet=data-mode, action=${args.step.action}`);
        }

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
                debugLines: debug.all(),
            },
        });

        addStepResult(args.context, result);
        return result;
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);

        const result = buildFailureResult({
            step: args.step,
            startedAt,
            message,
            debugLines: debug.all(),
        });

        addStepResult(args.context, result);
        return result;
    }
}