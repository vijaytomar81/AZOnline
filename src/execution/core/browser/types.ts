// src/execution/core/browser/types.ts

import type { Browser, BrowserContext, Page } from "@playwright/test";

export type BrowserSession = {
    browser: Browser;
    browserContext: BrowserContext;
    page: Page;
};
