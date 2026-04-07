// src/automation/base/BaseWaits.ts

import type { Page } from "@playwright/test";
import { executionConfig } from "@configLayer/execution.config";
import type { AliasMap } from "@frameworkCore/automation/engine";
import type {
    AutomationPageDriver,
    ElementsMap,
} from "./AutomationPageDriver";

export class BaseWaits {
    private readonly driver: AutomationPageDriver;
    private readonly page: Page;
    private readonly pageReadyTimeoutMs: number;

    constructor(driver: AutomationPageDriver, page: Page) {
        this.driver = driver;
        this.page = page;
        this.pageReadyTimeoutMs =
            executionConfig.automation.waits.pageReadyTimeoutMs;
    }

    async waitForUrlContains(
        partialUrl: string,
        timeoutMs = this.pageReadyTimeoutMs
    ): Promise<void> {
        await this.page.waitForURL(
            (url) => url.toString().includes(partialUrl),
            { timeout: timeoutMs }
        );
    }

    async waitForVisibleByAlias<A extends AliasMap, E extends ElementsMap>(
        aliases: A,
        elements: E,
        aliasKey: keyof A,
        timeoutMs = this.pageReadyTimeoutMs
    ): Promise<void> {
        const resolved = await this.driver.resolveAliasLocator(
            aliases,
            elements,
            aliasKey
        );
        await resolved.locator.waitFor({ state: "visible", timeout: timeoutMs });
    }

    async waitForHiddenByAlias<A extends AliasMap, E extends ElementsMap>(
        aliases: A,
        elements: E,
        aliasKey: keyof A,
        timeoutMs = this.pageReadyTimeoutMs
    ): Promise<void> {
        const resolved = await this.driver.resolveAliasLocator(
            aliases,
            elements,
            aliasKey
        );
        await resolved.locator.waitFor({ state: "hidden", timeout: timeoutMs });
    }

    async waitForAttachedByAlias<A extends AliasMap, E extends ElementsMap>(
        aliases: A,
        elements: E,
        aliasKey: keyof A,
        timeoutMs = this.pageReadyTimeoutMs
    ): Promise<void> {
        const resolved = await this.driver.resolveAliasLocator(
            aliases,
            elements,
            aliasKey
        );
        await resolved.locator.waitFor({
            state: "attached",
            timeout: timeoutMs,
        });
    }

    async waitForNetworkIdleSafe(
        timeoutMs = this.pageReadyTimeoutMs
    ): Promise<void> {
        await this.page.waitForLoadState("networkidle", { timeout: timeoutMs });
    }
}