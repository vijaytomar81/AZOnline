// src/execution/core/step/resolveStepExecutionData.ts

import type { ScenarioStep } from "@execution/modes/e2e/scenario/types";
import type { ExecutionContext } from "@execution/core/context/executionContext.types";
import {
    resolveStepData,
    type StepDataResolverRegistry,
} from "@execution/runtime/resolveStepData";
import {
    buildOverrideResolved,
    type ResolvedStepExecutionData,
} from "./buildOverrideResolved";
import type { StepDebugCollector } from "./createStepDebugCollector";

export function resolveStepExecutionData(args: {
    context: ExecutionContext;
    step: ScenarioStep;
    dataRegistry: StepDataResolverRegistry;
    logScope: string;
    debugCollector: StepDebugCollector;
    overrideStepData?: Record<string, unknown>;
}): ResolvedStepExecutionData {
    if (args.overrideStepData) {
        const resolved = buildOverrideResolved(
            args.step,
            args.overrideStepData
        );

        args.debugCollector.push(
            `Using override step data -> action=${args.step.action}, testCaseId=${args.step.testCaseId}`
        );
        args.debugCollector.push(
            `Resolved source -> sheet=${resolved.sourceFileSheet}, action=${resolved.source.action}`
        );

        return resolved;
    }

    return resolveStepData({
        registry: args.dataRegistry,
        journey: args.context.scenario.journey,
        step: args.step,
        logScope: args.logScope,
        debugCollector: args.debugCollector,
    });
}
