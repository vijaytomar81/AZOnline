// src/frameworkCore/executionLayer/core/browser/closeBrowserSession.ts

import type { BrowserSession } from "./types";

export async function closeBrowserSession(
    session?: BrowserSession
): Promise<void> {
    if (!session) {
        return;
    }

    await session.browserContext.close();
    await session.browser.close();
}
