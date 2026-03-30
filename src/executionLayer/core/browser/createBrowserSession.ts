// src/executionLayer/core/browser/createBrowserSession.ts

import { executionConfig } from "@config/execution.config";
import type { BrowserSession } from "./types";
import { getBrowserLauncher } from "./getBrowserLauncher";

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
