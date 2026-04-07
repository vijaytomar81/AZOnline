// src/executionLayer/core/browser/getBrowserLauncher.ts

import { chromium, firefox, webkit } from "@playwright/test";
import { executionConfig } from "@configLayer/execution.config";

export function getBrowserLauncher() {
    const name = executionConfig.browser.name;

    if (name === "firefox") {
        return firefox;
    }

    if (name === "webkit") {
        return webkit;
    }

    return chromium;
}
