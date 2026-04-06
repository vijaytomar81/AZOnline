// src/pageActions/shared/types.ts

import type { Page } from "@playwright/test";
import type { ExecutionContext } from "@executionLayer/contracts";
import type { PageManager } from "@pageObjects/pageManager";

export type PageActionContext = {
    executionContext: ExecutionContext;
    page: Page;
    pages: PageManager;
    logScope: string;
};

export type PageActionArgs<TPayload = Record<string, unknown>> = {
    context: PageActionContext;
    payload?: TPayload;
};

export type PageActionResult = {
    captured?: Record<string, unknown>;
    debugLines?: string[];
};

export type PageAction<TPayload = Record<string, unknown>> = (
    args: PageActionArgs<TPayload>
) => Promise<PageActionResult | void>;
