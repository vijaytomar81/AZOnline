// src/automation/base/BasePageAliasBridge.ts

import { executionConfig } from "@config/execution.config";
import type { AliasMap, ElementDef } from "@automation/engine";
import type {
    AutomationPageDriver,
    ElementsMap,
    ResolvedAliasLocator,
} from "./AutomationPageDriver";
import { BasePageRuntime } from "./BasePageRuntime";
import {
    getElementDefFromKey,
    getElementKeyFromAlias,
} from "./BasePageAliasResolver";

export class BasePageAliasBridge implements AutomationPageDriver {
    constructor(private readonly runtime: BasePageRuntime) { }

    async resolveByKey(
        elementKey: string,
        def: ElementDef
    ): Promise<ResolvedAliasLocator> {
        return await this.runtime.resolveByKey(elementKey, def);
    }

    async clickByKey(elementKey: string, def: ElementDef): Promise<void> {
        const { locator } = await this.resolveByKey(elementKey, def);
        await locator.click({
            timeout: executionConfig.automation.waits.actionTimeoutMs,
        });
    }

    async fillByKey(
        elementKey: string,
        def: ElementDef,
        value: string
    ): Promise<void> {
        const { locator } = await this.resolveByKey(elementKey, def);
        await locator.fill(value, {
            timeout: executionConfig.automation.waits.actionTimeoutMs,
        });
    }

    async typeByKey(
        elementKey: string,
        def: ElementDef,
        value: string
    ): Promise<void> {
        const { locator } = await this.resolveByKey(elementKey, def);
        await locator.type(value, {
            timeout: executionConfig.automation.waits.actionTimeoutMs,
        });
    }

    async selectOptionByKey(
        elementKey: string,
        def: ElementDef,
        value: string
    ): Promise<void> {
        const { locator } = await this.resolveByKey(elementKey, def);
        await locator.selectOption(value, {
            timeout: executionConfig.automation.waits.actionTimeoutMs,
        });
    }

    async resolveByAlias<A extends AliasMap, E extends ElementsMap>(
        aliases: A,
        elements: E,
        aliasKey: keyof A
    ): Promise<ResolvedAliasLocator> {
        const elementKey = getElementKeyFromAlias(aliases, aliasKey);
        const def = getElementDefFromKey(elements, elementKey);
        return await this.resolveByKey(elementKey, def);
    }

    async clickByAlias<A extends AliasMap, E extends ElementsMap>(
        aliases: A,
        elements: E,
        aliasKey: keyof A
    ): Promise<void> {
        const elementKey = getElementKeyFromAlias(aliases, aliasKey);
        const def = getElementDefFromKey(elements, elementKey);
        await this.clickByKey(elementKey, def);
    }

    async fillByAlias<A extends AliasMap, E extends ElementsMap>(
        aliases: A,
        elements: E,
        aliasKey: keyof A,
        value: string
    ): Promise<void> {
        const elementKey = getElementKeyFromAlias(aliases, aliasKey);
        const def = getElementDefFromKey(elements, elementKey);
        await this.fillByKey(elementKey, def, value);
    }

    async typeByAlias<A extends AliasMap, E extends ElementsMap>(
        aliases: A,
        elements: E,
        aliasKey: keyof A,
        value: string
    ): Promise<void> {
        const elementKey = getElementKeyFromAlias(aliases, aliasKey);
        const def = getElementDefFromKey(elements, elementKey);
        await this.typeByKey(elementKey, def, value);
    }

    async selectOptionByAlias<A extends AliasMap, E extends ElementsMap>(
        aliases: A,
        elements: E,
        aliasKey: keyof A,
        value: string
    ): Promise<void> {
        const elementKey = getElementKeyFromAlias(aliases, aliasKey);
        const def = getElementDefFromKey(elements, elementKey);
        await this.selectOptionByKey(elementKey, def, value);
    }

    async resolveAliasLocator<A extends AliasMap, E extends ElementsMap>(
        aliases: A,
        elements: E,
        aliasKey: keyof A
    ): Promise<ResolvedAliasLocator> {
        return await this.resolveByAlias(aliases, elements, aliasKey);
    }

    async clickAlias<A extends AliasMap, E extends ElementsMap>(
        aliases: A,
        elements: E,
        aliasKey: keyof A
    ): Promise<void> {
        await this.clickByAlias(aliases, elements, aliasKey);
    }

    async fillAlias<A extends AliasMap, E extends ElementsMap>(
        aliases: A,
        elements: E,
        aliasKey: keyof A,
        value: string
    ): Promise<void> {
        await this.fillByAlias(aliases, elements, aliasKey, value);
    }

    async typeAlias<A extends AliasMap, E extends ElementsMap>(
        aliases: A,
        elements: E,
        aliasKey: keyof A,
        value: string
    ): Promise<void> {
        await this.typeByAlias(aliases, elements, aliasKey, value);
    }

    async selectAliasOption<A extends AliasMap, E extends ElementsMap>(
        aliases: A,
        elements: E,
        aliasKey: keyof A,
        value: string
    ): Promise<void> {
        await this.selectOptionByAlias(aliases, elements, aliasKey, value);
    }
}