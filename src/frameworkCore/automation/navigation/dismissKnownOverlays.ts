// src/automation/navigation/dismissKnownOverlays.ts

import type { Page } from "@playwright/test";
import { executionConfig } from "@configLayer/execution.config";

export async function dismissKnownOverlays(page: Page): Promise<void> {
    const selectors = [
        'button:has-text("Accept")',
        'button:has-text("Accept All")',
        'button:has-text("Close")',
        'button[aria-label="Close"]',
    ];

    const overlayTimeoutMs =
        executionConfig.automation.waits.overlayTimeoutMs;
    const actionTimeoutMs =
        executionConfig.automation.waits.actionTimeoutMs;

    for (const selector of selectors) {
        const locator = page.locator(selector).first();

        try {
            if (await locator.isVisible({ timeout: overlayTimeoutMs })) {
                await locator.click({ timeout: actionTimeoutMs });
            }
        } catch {
            // intentionally ignore overlay dismissal failures
        }
    }
}
