// src/execution/runtime/browserSession.ts

import { chromium, firefox, webkit, type Browser, type BrowserContext, type Page } from "@playwright/test";
import { executionConfig } from "../../config/execution.config";
import type { ExecutionContext } from "./executionContext";

export type BrowserSession = {
    browser: Browser;
    browserContext: BrowserContext;
    page: Page;
};

function getBrowserLauncher() {
    const name = executionConfig.browser.name;

    if (name === "firefox") return firefox;
    if (name === "webkit") return webkit;
    return chromium;
}

export async function createBrowserSession(): Promise<BrowserSession> {
    const launcher = getBrowserLauncher();

    const browser = await launcher.launch({
        headless: executionConfig.browser.headless,
        channel: executionConfig.browser.channel,
    });

    const browserContext = await browser.newContext();
    const page = await browserContext.newPage();

    return {
        browser,
        browserContext,
        page,
    };
}

export function attachBrowserSession(
    context: ExecutionContext,
    session: BrowserSession
): void {
    context.browser = session.browser;
    context.browserContext = session.browserContext;
    context.page = session.page;
}

export async function closeBrowserSession(
    session?: BrowserSession
): Promise<void> {
    if (!session) return;

    await session.browserContext.close();
    await session.browser.close();
}