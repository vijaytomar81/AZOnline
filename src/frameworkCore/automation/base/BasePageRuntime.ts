// src/frameworkCore/automation/base/BasePageRuntime.ts

import type { Page } from "@playwright/test";
import { executionConfig } from "@configLayer/execution.config";
import {
    PageFx,
    SelfHealWriter,
    type BasePageOptions,
    type ElementDef,
    type HealEvent,
} from "@frameworkCore/automation/engine";
import type { ResolvedAliasLocator } from "./AutomationPageDriver";

export class BasePageRuntime {
    readonly page: Page;
    readonly pageKey: string;
    readonly fx: PageFx;

    private readonly healWriter: SelfHealWriter;
    private readonly healWriteEnabled: boolean;

    constructor(page: Page, pageKey: string, opts: BasePageOptions = {}) {
        this.page = page;
        this.pageKey = pageKey;

        this.healWriteEnabled = process.env.SELF_HEAL_WRITE === "true";
        this.healWriter = new SelfHealWriter({
            enabled: this.healWriteEnabled,
            prefix: "[self-heal]",
        });

        this.fx = new PageFx(page, {
            verbose:
                opts.verboseEngine ?? process.env.VERBOSE_ENGINE === "true",
            selfHeal:
                opts.selfHeal ??
                executionConfig.automation.selfHeal.runtimeEnabled,
            timeoutMs:
                opts.actionTimeoutMs ??
                executionConfig.automation.waits.actionTimeoutMs,
            prefix: "[pw]",
            onHealed: ({ preferredWas, preferredNow }) => {
                void preferredWas;
                void preferredNow;
            },
        });
    }

    getSelfHealEvents(): HealEvent[] {
        return this.healWriter.getEvents();
    }

    clearSelfHealEvents(): void {
        this.healWriter.clearEvents();
    }

    async goto(url: string): Promise<void> {
        await this.page.goto(url, { waitUntil: "domcontentloaded" });
    }

    async waitForNetworkIdle(timeoutMs = 10_000): Promise<void> {
        await this.page.waitForLoadState("networkidle", { timeout: timeoutMs });
    }

    async resolveByKey(
        elementKey: string,
        def: ElementDef
    ): Promise<ResolvedAliasLocator> {
        const beforePreferred = def.preferred;
        const result = await this.fx.resolveKey(this.pageKey, elementKey, def);

        if (this.healWriteEnabled && def.preferred !== beforePreferred) {
            this.healWriter.apply({
                pageKey: this.pageKey,
                elementKey,
                preferredWas: beforePreferred,
                preferredNow: def.preferred,
            });
        }

        return result;
    }
}