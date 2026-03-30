// src/executionLayer/contracts/ExecutionContext.ts

import type { Browser, BrowserContext, Page } from "@playwright/test";
import type { ExecutionScenario } from "./ExecutionScenario";
import type { ExecutionItemResult } from "./ExecutionResult";

export type ExecutionContext = {
    scenario: ExecutionScenario;
    currentPolicyNumber?: string;
    currentQuoteNumber?: string;
    currentTransactionId?: string;
    outputs: Record<string, unknown>;
    itemResults: ExecutionItemResult[];
    browser?: Browser;
    browserContext?: BrowserContext;
    page?: Page;
};
