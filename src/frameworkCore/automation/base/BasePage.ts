// src/automation/base/BasePage.ts

import type { Locator, Page } from "@playwright/test";
import { executionConfig } from "@configLayer/execution.config";
import type { BasePageOptions } from "@frameworkCore/automation/engine";
import { BaseActions } from "./BaseActions";
import { BaseReads } from "./BaseReads";
import { BaseWaits } from "./BaseWaits";
import { BasePageAliasBridge } from "./BasePageAliasBridge";
import { BasePageNavigation } from "./BasePageNavigation";
import { BasePageRuntime } from "./BasePageRuntime";
import type {
    AutomationPageDriver,
    ElementsMap,
    ResolvedAliasLocator,
} from "./AutomationPageDriver";
import type { AliasMap } from "@frameworkCore/automation/engine";

export type StandardReadyInput = {
    expectedUrlPart?: string;
    readinessLocator?: Locator;
    readinessLocators?: Locator[];
    dismissOverlays?: boolean;
    waitForNetworkIdle?: boolean;
    timeoutMs?: number;
};

export abstract class BasePage implements AutomationPageDriver {
    protected readonly page: Page;
    protected readonly pageKey: string;

    readonly actions: BaseActions;
    readonly waits: BaseWaits;
    readonly reads: BaseReads;

    private readonly runtime: BasePageRuntime;
    private readonly aliasBridge: BasePageAliasBridge;
    private readonly navigation: BasePageNavigation;

    protected constructor(
        page: Page,
        pageKey: string,
        opts: BasePageOptions = {}
    ) {
        this.runtime = new BasePageRuntime(page, pageKey, {
            ...opts,
            selfHeal:
                opts.selfHeal ??
                executionConfig.automation.selfHeal.runtimeEnabled,
            actionTimeoutMs:
                opts.actionTimeoutMs ??
                executionConfig.automation.waits.actionTimeoutMs,
        });

        this.page = this.runtime.page;
        this.pageKey = this.runtime.pageKey;

        this.aliasBridge = new BasePageAliasBridge(this.runtime);
        this.navigation = new BasePageNavigation(
            this.page,
            this.goto.bind(this),
            this.waitUntilReady.bind(this)
        );

        this.actions = new BaseActions(this);
        this.waits = new BaseWaits(this, this.page);
        this.reads = new BaseReads(this);
    }

    getSelfHealEvents() {
        return this.runtime.getSelfHealEvents();
    }

    clearSelfHealEvents() {
        this.runtime.clearSelfHealEvents();
    }

    async goto(url: string): Promise<void> {
        await this.runtime.goto(url);
    }

    async waitForNetworkIdle(timeoutMs = 10_000): Promise<void> {
        await this.runtime.waitForNetworkIdle(timeoutMs);
    }

    async resolveAliasLocator<A extends AliasMap, E extends ElementsMap>(
        aliases: A,
        elements: E,
        aliasKey: keyof A
    ): Promise<ResolvedAliasLocator> {
        return await this.aliasBridge.resolveAliasLocator(
            aliases,
            elements,
            aliasKey
        );
    }

    async clickAlias<A extends AliasMap, E extends ElementsMap>(
        aliases: A,
        elements: E,
        aliasKey: keyof A
    ): Promise<void> {
        await this.aliasBridge.clickAlias(aliases, elements, aliasKey);
    }

    async fillAlias<A extends AliasMap, E extends ElementsMap>(
        aliases: A,
        elements: E,
        aliasKey: keyof A,
        value: string
    ): Promise<void> {
        await this.aliasBridge.fillAlias(aliases, elements, aliasKey, value);
    }

    async typeAlias<A extends AliasMap, E extends ElementsMap>(
        aliases: A,
        elements: E,
        aliasKey: keyof A,
        value: string
    ): Promise<void> {
        await this.aliasBridge.typeAlias(aliases, elements, aliasKey, value);
    }

    async selectAliasOption<A extends AliasMap, E extends ElementsMap>(
        aliases: A,
        elements: E,
        aliasKey: keyof A,
        value: string
    ): Promise<void> {
        await this.aliasBridge.selectAliasOption(
            aliases,
            elements,
            aliasKey,
            value
        );
    }

    async open(url: string): Promise<void> {
        await this.navigation.open(url);
    }

    async dismissOverlays(): Promise<void> {
        await this.navigation.dismissOverlays();
    }

    async waitForStandardReady(input: StandardReadyInput = {}): Promise<void> {
        await this.navigation.waitForStandardReady(input);
    }

    async openAndWaitUntilReady(
        url: string,
        input: StandardReadyInput = {}
    ): Promise<void> {
        await this.navigation.openAndWaitUntilReady(url, input);
    }

    async waitUntilReady(): Promise<void> {
        return;
    }
}