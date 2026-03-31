// src/automation/base/AutomationPageDriver.ts

import type { Locator } from "@playwright/test";
import type { AliasMap } from "@core/basePage";
import type { ElementDef } from "@core/locatorEngine";

export type ElementsMap = Record<string, ElementDef>;

export type ResolvedAliasLocator = {
    locator: Locator;
    used: string;
    pageKey: string;
    elementKey: string;
};

export type AutomationPageDriver = {
    resolveAliasLocator<A extends AliasMap, E extends ElementsMap>(
        aliases: A,
        elements: E,
        aliasKey: keyof A
    ): Promise<ResolvedAliasLocator>;

    clickAlias<A extends AliasMap, E extends ElementsMap>(
        aliases: A,
        elements: E,
        aliasKey: keyof A
    ): Promise<void>;

    fillAlias<A extends AliasMap, E extends ElementsMap>(
        aliases: A,
        elements: E,
        aliasKey: keyof A,
        value: string
    ): Promise<void>;

    typeAlias<A extends AliasMap, E extends ElementsMap>(
        aliases: A,
        elements: E,
        aliasKey: keyof A,
        value: string
    ): Promise<void>;

    selectAliasOption<A extends AliasMap, E extends ElementsMap>(
        aliases: A,
        elements: E,
        aliasKey: keyof A,
        value: string
    ): Promise<void>;
};
