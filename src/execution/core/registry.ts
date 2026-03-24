// src/execution/core/registry.ts

import { normalizeSpaces, toCamelFromText } from "@utils/text";
import type { ExecutionContext } from "./executionContext";
import type { ScenarioStep } from "@execution/modes/e2e/scenario/types";

export type StepExecutorArgs = {
    context: ExecutionContext;
    step: ScenarioStep;
    stepData?: Record<string, unknown>;
};

export type StepExecutor = (args: StepExecutorArgs) => Promise<void>;

export type ExecutorRegistry = Record<string, StepExecutor>;

function normalizeKeyPart(value?: string): string {
    return value ? toCamelFromText(normalizeSpaces(value)) : "";
}

export function buildExecutorKey(args: {
    action: string;
    journey?: string;
    portal?: string;
    subType?: string;
}): string {
    const action = normalizeKeyPart(args.action);
    const journey = normalizeKeyPart(args.journey);
    const portal = normalizeKeyPart(args.portal);
    const subType = normalizeKeyPart(args.subType);

    return [action, journey, portal, subType].filter(Boolean).join(":");
}

export function createExecutorRegistry(): ExecutorRegistry {
    return {};
}

export function registerExecutor(
    registry: ExecutorRegistry,
    args: {
        action: string;
        journey?: string;
        portal?: string;
        subType?: string;
        executor: StepExecutor;
    }
): void {
    const key = buildExecutorKey(args);
    registry[key] = args.executor;
}

export function getExecutor(
    registry: ExecutorRegistry,
    context: ExecutionContext,
    step: ScenarioStep
): StepExecutor | undefined {
    const keys = [
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

    return keys.map((key) => registry[key]).find(Boolean);
}