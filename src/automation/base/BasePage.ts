// src/automation/base/BasePage.ts

import type { Locator, Page } from "@playwright/test";
import { executionConfig } from "@config/execution.config";
import {
    basePage,
    type AliasMap,
    type BasePageOptions,
} from "@core/basePage";
import type { ElementDef } from "@core/locatorEngine";
import { dismissKnownOverlays } from "@automation/navigation/dismissKnownOverlays";
import { waitForPageReady } from "@automation/navigation/waitForPageReady";
import { BaseActions } from "./BaseActions";
import { BaseReads } from "./BaseReads";
import { BaseWaits } from "./BaseWaits";
import type {
    AutomationPageDriver,
    ElementsMap,
    ResolvedAliasLocator,
} from "./AutomationPageDriver";

export type StandardReadyInput = {
    expectedUrlPart?: string;
    readinessLocator?: Locator;
    readinessLocators?: Locator[];
    dismissOverlays?: boolean;
    waitForNetworkIdle?: boolean;
    timeoutMs?: number;
};

export abstract class BasePage
    extends basePage
    implements AutomationPageDriver
{
    readonly actions: BaseActions;
    readonly waits: BaseWaits;
    readonly reads: BaseReads;

    protected constructor(
        page: Page,
        pageKey: string,
        opts: BasePageOptions = {}
    ) {
        super(page, pageKey, {
            ...opts,
            selfHeal:
                opts.selfHeal ??
                executionConfig.automation.selfHeal.runtimeEnabled,
            actionTimeoutMs:
                opts.actionTimeoutMs ??
                executionConfig.automation.waits.actionTimeoutMs,
        });

        this.actions = new BaseActions(this);
        this.waits = new BaseWaits(this, page);
        this.reads = new BaseReads(this);
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

    async open(url: string): Promise<void> {
        await this.goto(url);
    }

    async dismissOverlays(): Promise<void> {
        await dismissKnownOverlays(this.page);
    }

    async waitForStandardReady(input: StandardReadyInput = {}): Promise<void> {
        const shouldDismissOverlays = input.dismissOverlays !== false;

        if (shouldDismissOverlays) {
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

    async waitUntilReady(): Promise<void> {
        return;
    }

    protected getElementDef<E extends Record<string, ElementDef>>(
        elements: E,
        elementKey: keyof E
    ): ElementDef {
        return elements[String(elementKey)];
    }
}
