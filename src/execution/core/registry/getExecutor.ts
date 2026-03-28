// src/execution/core/registry/getExecutor.ts

import type { ScenarioStep } from "@execution/modes/e2e/scenario/types";
import type { ExecutionContext } from "@execution/core/context/executionContext.types";
import { buildExecutorKey } from "./buildExecutorKey";
import type { ExecutorRegistry, StepExecutor } from "./types";

function buildExecutorLookupKeys(
    context: ExecutionContext,
    step: ScenarioStep
): string[] {
    return [
        buildExecutorKey({
            action: step.action,
            journey: context.scenario.journey,
            portal: step.portal,
            subType: step.subType,
        }),
        buildExecutorKey({
            action: step.action,
            journey: context.scenario.journey,
            portal: step.portal,
        }),
        buildExecutorKey({
            action: step.action,
            journey: context.scenario.journey,
        }),
        buildExecutorKey({
            action: step.action,
            portal: step.portal,
            subType: step.subType,
        }),
        buildExecutorKey({
            action: step.action,
        }),
    ];
}

export function getExecutor(
    registry: ExecutorRegistry,
    context: ExecutionContext,
    step: ScenarioStep
): StepExecutor | undefined {
    return buildExecutorLookupKeys(context, step)
        .map((key) => registry[key])
        .find(Boolean);
}
