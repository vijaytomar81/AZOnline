// src/execution/core/context/executionContext.types.ts

import type { Browser, BrowserContext, Page } from "@playwright/test";
import type { ExecutionScenario } from "@execution/modes/e2e/scenario/types";
import type { StepExecutionResult } from "@execution/core/result";

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
