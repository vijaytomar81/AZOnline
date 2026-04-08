// src/frameworkCore/automation/base/BaseReads.ts

import { executionConfig } from "@configLayer/execution.config";
import type { AliasMap } from "@frameworkCore/automation/engine";
import type {
    AutomationPageDriver,
    ElementsMap,
} from "./AutomationPageDriver";

export class BaseReads {
    private readonly driver: AutomationPageDriver;
    private readonly actionTimeoutMs: number;

    constructor(driver: AutomationPageDriver) {
        this.driver = driver;
        this.actionTimeoutMs = executionConfig.automation.waits.actionTimeoutMs;
    }

    async isVisibleByAlias<A extends AliasMap, E extends ElementsMap>(
        aliases: A,
        elements: E,
        aliasKey: keyof A
    ): Promise<boolean> {
        const resolved = await this.driver.resolveAliasLocator(
            aliases,
            elements,
            aliasKey
        );
        return await resolved.locator.isVisible({
            timeout: this.actionTimeoutMs,
        });
    }

    async getTextByAlias<A extends AliasMap, E extends ElementsMap>(
        aliases: A,
        elements: E,
        aliasKey: keyof A
    ): Promise<string> {
        const resolved = await this.driver.resolveAliasLocator(
            aliases,
            elements,
            aliasKey
        );
        return (await resolved.locator.textContent()) ?? "";
    }

    async getInputValueByAlias<A extends AliasMap, E extends ElementsMap>(
        aliases: A,
        elements: E,
        aliasKey: keyof A
    ): Promise<string> {
        const resolved = await this.driver.resolveAliasLocator(
            aliases,
            elements,
            aliasKey
        );
        return await resolved.locator.inputValue({
            timeout: this.actionTimeoutMs,
        });
    }

    async isCheckedByAlias<A extends AliasMap, E extends ElementsMap>(
        aliases: A,
        elements: E,
        aliasKey: keyof A
    ): Promise<boolean> {
        const resolved = await this.driver.resolveAliasLocator(
            aliases,
            elements,
            aliasKey
        );
        return await resolved.locator.isChecked({
            timeout: this.actionTimeoutMs,
        });
    }
}