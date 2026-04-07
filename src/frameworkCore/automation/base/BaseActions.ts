// src/automation/base/BaseActions.ts

import { executionConfig } from "@configLayer/execution.config";
import type { AliasMap } from "@frameworkCore/automation/engine";
import type {
    AutomationPageDriver,
    ElementsMap,
} from "./AutomationPageDriver";

export class BaseActions {
    private readonly driver: AutomationPageDriver;
    private readonly actionTimeoutMs: number;

    constructor(driver: AutomationPageDriver) {
        this.driver = driver;
        this.actionTimeoutMs = executionConfig.automation.waits.actionTimeoutMs;
    }

    async clickByAlias<A extends AliasMap, E extends ElementsMap>(
        aliases: A,
        elements: E,
        aliasKey: keyof A
    ): Promise<void> {
        await this.driver.clickAlias(aliases, elements, aliasKey);
    }

    async fillByAlias<A extends AliasMap, E extends ElementsMap>(
        aliases: A,
        elements: E,
        aliasKey: keyof A,
        value: string
    ): Promise<void> {
        await this.driver.fillAlias(aliases, elements, aliasKey, value);
    }

    async typeByAlias<A extends AliasMap, E extends ElementsMap>(
        aliases: A,
        elements: E,
        aliasKey: keyof A,
        value: string
    ): Promise<void> {
        await this.driver.typeAlias(aliases, elements, aliasKey, value);
    }

    async selectOptionByAlias<A extends AliasMap, E extends ElementsMap>(
        aliases: A,
        elements: E,
        aliasKey: keyof A,
        value: string
    ): Promise<void> {
        await this.driver.selectAliasOption(aliases, elements, aliasKey, value);
    }

    async clickIfVisibleByAlias<A extends AliasMap, E extends ElementsMap>(
        aliases: A,
        elements: E,
        aliasKey: keyof A
    ): Promise<boolean> {
        const resolved = await this.driver.resolveAliasLocator(
            aliases,
            elements,
            aliasKey
        );
        const visible = await resolved.locator.isVisible({
            timeout: this.actionTimeoutMs,
        });

        if (!visible) {
            return false;
        }

        await resolved.locator.click({ timeout: this.actionTimeoutMs });
        return true;
    }

    async clearAndFillByAlias<A extends AliasMap, E extends ElementsMap>(
        aliases: A,
        elements: E,
        aliasKey: keyof A,
        value: string
    ): Promise<void> {
        const resolved = await this.driver.resolveAliasLocator(
            aliases,
            elements,
            aliasKey
        );

        await resolved.locator.clear({ timeout: this.actionTimeoutMs });
        await resolved.locator.fill(value, { timeout: this.actionTimeoutMs });
    }
}