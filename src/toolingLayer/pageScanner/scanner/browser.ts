// src/toolingLayer/pageScanner/scanner/browser.ts

import { chromium } from "@playwright/test";
import type { Page } from "@playwright/test";
import type { ScanPageOptions } from "./types";

export async function connectAndGetPage(opts: ScanPageOptions): Promise<{
    page: Page;
    detach: () => Promise<void>;
    url: string;
}> {
    const browser = await chromium.connectOverCDP(opts.connectCdp);

    const contexts = browser.contexts();
    if (!contexts.length) {
        await browser.close();
        throw new Error("No browser contexts found via CDP.");
    }

    const ctx = contexts[0];
    const pages = ctx.pages();
    if (!pages.length) {
        await browser.close();
        throw new Error("No tabs/pages found in the connected browser.");
    }

    const tabIndex = opts.tabIndex ?? 0;
    if (tabIndex < 0 || tabIndex >= pages.length) {
        await browser.close();
        throw new Error(`tabIndex ${tabIndex} is out of range. Available tabs: ${pages.length}`);
    }

    const page = pages[tabIndex];
    const url = page.url();

    // CDP attach: close() detaches Playwright, browser stays open.
    const detach = async () => {
        await browser.close();
    };

    return { page, detach, url };
}