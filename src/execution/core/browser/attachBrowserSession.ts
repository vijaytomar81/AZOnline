// src/execution/core/browser/attachBrowserSession.ts

import type { ExecutionContext } from "@execution/core/context/executionContext.types";
import type { BrowserSession } from "./types";

export function attachBrowserSession(
    context: ExecutionContext,
    session: BrowserSession
): void {
    context.browser = session.browser;
    context.browserContext = session.browserContext;
    context.page = session.page;
}
