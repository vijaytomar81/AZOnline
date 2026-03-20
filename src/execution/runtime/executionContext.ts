// src/execution/runtime/executionContext.ts

import type { ExecutionScenario } from "../scenario/types";
import type { StepExecutionResult } from "./result";

export type ExecutionContext = {
    scenario: ExecutionScenario;
    currentPolicyNumber?: string;
    currentQuoteNumber?: string;
    currentTransactionId?: string;
    outputs: Record<string, unknown>;
    stepResults: StepExecutionResult[];
};

export function createExecutionContext(
    scenario: ExecutionScenario
): ExecutionContext {
    return {
        scenario,
        currentPolicyNumber: scenario.policyNumber,
        currentQuoteNumber: undefined,
        currentTransactionId: undefined,
        outputs: {},
        stepResults: [],
    };
}

export function setContextOutput(
    context: ExecutionContext,
    key: string,
    value: unknown
): void {
    context.outputs[key] = value;
}

export function getContextOutput<T>(
    context: ExecutionContext,
    key: string
): T | undefined {
    return context.outputs[key] as T | undefined;
}

export function addStepResult(
    context: ExecutionContext,
    result: StepExecutionResult
): void {
    context.stepResults.push(result);
}