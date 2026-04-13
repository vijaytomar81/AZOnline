// src/frameworkCore/executionLayer/contracts/ExecutionContext.ts

import type { Browser, BrowserContext, Page } from "@playwright/test";
import type { ExecutionScenario } from "./ExecutionScenario";
import type { ExecutionItemResult } from "./ExecutionResult";
import type { BrowserInfo } from "@frameworkCore/executionLayer/core/browser/types";
import type { TargetEnvUrls } from "@configLayer/environments";

export type ExecutionContext = {
    scenario: ExecutionScenario;
    env: TargetEnvUrls;
    currentPolicyNumber?: string;
    currentQuoteNumber?: string;
    currentTransactionId?: string;
    outputs: Record<string, unknown>;
    itemResults: ExecutionItemResult[];

    browser?: Browser;
    browserContext?: BrowserContext;
    page?: Page;

    browserInfo?: BrowserInfo;
};