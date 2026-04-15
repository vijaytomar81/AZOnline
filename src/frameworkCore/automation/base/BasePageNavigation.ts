// src/frameworkCore/automation/base/BasePageNavigation.ts

import type { Page } from "@playwright/test";
import { dismissKnownOverlays } from "@frameworkCore/automation/navigation/dismissKnownOverlays";
import { waitForPageReady } from "@frameworkCore/automation/navigation/waitForPageReady";
import type { StandardReadyInput } from "./BasePage";

export class BasePageNavigation {
    constructor(
        private readonly page: Page,
        private readonly goto: (url: string) => Promise<void>,
        private readonly waitUntilReady: () => Promise<void>
    ) { }

    async open(url: string): Promise<void> {
        await this.goto(url);
    }

    async dismissOverlays(): Promise<void> {
        await dismissKnownOverlays(this.page);
    }

    async waitForStandardReady(input: StandardReadyInput = {}): Promise<void> {
        if (input.dismissOverlays !== false) {
            await this.dismissOverlays();
        }

        await waitForPageReady({
            page: this.page,
            expectedUrlPart: input.expectedUrlPart,
            readinessLocator: input.readinessLocator,
            readinessLocators: input.readinessLocators,
            waitForNetworkIdle: input.waitForNetworkIdle,
            timeoutMs: input.timeoutMs,
        });
    }

    async openAndWaitUntilReady(
        url: string,
        input: StandardReadyInput = {}
    ): Promise<void> {
        await this.open(url);
        await this.waitForStandardReady(input);
        await this.waitUntilReady();
    }
}