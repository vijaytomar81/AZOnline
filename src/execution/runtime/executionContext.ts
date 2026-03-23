// src/execution/runtime/executionContext.ts

import type { Browser, BrowserContext, Page } from "@playwright/test";
import type { ExecutionScenario } from "../scenario/types";
import type { StepExecutionResult } from "./result";

export type ExecutionContext = {
    scenario: ExecutionScenario;
    currentPolicyNumber?: string;
    currentQuoteNumber?: string;
    currentTransactionId?: string;
    outputs: Record<string, unknown>;
    stepResults: StepExecutionResult[];
    browser?: Browser;
    browserContext?: BrowserContext;
    page?: Page;
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
        browser: undefined,
        browserContext: undefined,
        page: undefined,
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