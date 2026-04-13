// src/frameworkCore/automation/navigation/waitForPageReady.ts

import type { Page, Locator } from "@playwright/test";
import { executionConfig } from "@configLayer/execution/execution.config";

export type WaitForPageReadyInput = {
    page: Page;
    expectedUrlPart?: string;
    readinessLocator?: Locator;
    readinessLocators?: Locator[];
    waitForNetworkIdle?: boolean;
    timeoutMs?: number;
};

export async function waitForPageReady(
    input: WaitForPageReadyInput
): Promise<void> {
    const timeoutMs =
        input.timeoutMs ??
        executionConfig.automation.waits.pageReadyTimeoutMs;

    if (input.expectedUrlPart) {
        await input.page.waitForURL(
            (url) => url.toString().includes(input.expectedUrlPart as string),
            { timeout: timeoutMs }
        );
    }

    const locators: Locator[] = [
        ...(input.readinessLocator ? [input.readinessLocator] : []),
        ...(input.readinessLocators ?? []),
    ];

    for (const locator of locators) {
        await locator.waitFor({
            state: "visible",
            timeout: timeoutMs,
        });
    }

    if (input.waitForNetworkIdle) {
        await input.page.waitForLoadState("networkidle", {
            timeout: timeoutMs,
        });
    }
}
