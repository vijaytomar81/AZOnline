// src/frameworkCore/executionLayer/core/browser/types.ts

import type { Browser, BrowserContext, Page } from "@playwright/test";

/**
 * Browser metadata (for reporting)
 */
export type BrowserInfo = {
    name: string;
    channel?: string;
    version?: string;
    headless: boolean;
};

/**
 * Browser session (execution + metadata)
 */
export type BrowserSession = {
    browser: Browser;
    browserContext: BrowserContext;
    page: Page;
    info: BrowserInfo;
};