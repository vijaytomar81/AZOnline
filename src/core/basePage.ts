// src/core/basePage.ts
import type { Page } from "@playwright/test";
import { PageFx } from "./pageFx";
import { SelfHealWriter } from "./selfHealWriter";
import type { ElementDef } from "./locatorEngine";

export type BasePageOptions = {
    verboseEngine?: boolean;
    selfHeal?: boolean;
    actionTimeoutMs?: number;
};

export type AliasMap = Record<string, string>;

export abstract class basePage {
    protected readonly page: Page;
    protected readonly pageKey: string;
    protected readonly fx: PageFx;

    // persistent self-heal (optional)
    private readonly healWriter: SelfHealWriter;
    private readonly healWriteEnabled: boolean;

    constructor(page: Page, pageKey: string, opts: BasePageOptions = {}) {
        this.page = page;
        this.pageKey = pageKey;

        // persistent heal toggle (OFF by default for safety)
        this.healWriteEnabled = process.env.SELF_HEAL_WRITE === "true";
        this.healWriter = new SelfHealWriter({
            enabled: this.healWriteEnabled,
            prefix: "[self-heal]",
        });

        this.fx = new PageFx(page, {
            verbose: opts.verboseEngine ?? process.env.VERBOSE_ENGINE === "true",
            selfHeal: opts.selfHeal ?? process.env.SELF_HEAL === "true",
            timeoutMs: opts.actionTimeoutMs ?? Number(process.env.ACTION_TIMEOUT ?? 10_000),
            prefix: "[pw]",
            onHealed: ({ preferredWas, preferredNow }) => {
                // We can only persist if caller provides pageKey/elementKey.
                // Persistent writing is done inside resolveByKey() below.
                void preferredWas;
                void preferredNow;
            },
        });
    }

    getSelfHealEvents() {
        return this.healWriter.getEvents();
    }

    clearSelfHealEvents() {
        this.healWriter.clearEvents();
    }

    async goto(url: string) {
        await this.page.goto(url, { waitUntil: "domcontentloaded" });
    }

    async waitForNetworkIdle(timeoutMs = 10_000) {
        await this.page.waitForLoadState("networkidle", { timeout: timeoutMs });
    }

    /**
     * Enterprise key-aware actions:
     * These enable persistent self-heal because we know pageKey + elementKey.
     *
     * pageKey should match the page-map json file name.
     * elementKey should match the key inside the generated elements.ts.
     */

    protected async resolveByKey(elementKey: string, def: ElementDef) {
        const beforePreferred = def.preferred;
        const res = await this.fx.resolveKey(this.pageKey, elementKey, def);

        // If runtime selfHeal promoted fallback -> preferred, def.preferred will change.
        // Persist that change when enabled.
        if (this.healWriteEnabled && def.preferred !== beforePreferred) {
            this.healWriter.apply({
                pageKey: this.pageKey,
                elementKey,
                preferredWas: beforePreferred,
                preferredNow: def.preferred,
            });
        }

        return res;
    }

    protected async clickByKey(elementKey: string, def: ElementDef) {
        const { locator } = await this.resolveByKey(elementKey, def);
        await locator.click({ timeout: Number(process.env.ACTION_TIMEOUT ?? 10_000) });
    }

    protected async fillByKey(elementKey: string, def: ElementDef, value: string) {
        const { locator } = await this.resolveByKey(elementKey, def);
        await locator.fill(value, { timeout: Number(process.env.ACTION_TIMEOUT ?? 10_000) });
    }

    protected async typeByKey(elementKey: string, def: ElementDef, value: string) {
        const { locator } = await this.resolveByKey(elementKey, def);
        await locator.type(value, { timeout: Number(process.env.ACTION_TIMEOUT ?? 10_000) });
    }

    protected async selectOptionByKey(elementKey: string, def: ElementDef, value: string) {
        const { locator } = await this.resolveByKey(elementKey, def);
        await locator.selectOption(value, { timeout: Number(process.env.ACTION_TIMEOUT ?? 10_000) });
    }

    // ============================================================
    // Alias Engine (enterprise)
    // ============================================================

    protected getElementKeyFromAlias<A extends AliasMap>(aliases: A, aliasKey: keyof A): string {
        const elementKey = aliases[String(aliasKey)];
        if (!elementKey) {
            throw new Error(`Alias "${String(aliasKey)}" not found in aliases map.`);
        }
        return elementKey;
    }

    protected getElementDefFromKey<E extends Record<string, ElementDef>>(elements: E, elementKey: string): ElementDef {
        const def = (elements as any)[elementKey] as ElementDef | undefined;
        if (!def) {
            throw new Error(`ElementKey "${elementKey}" not found in elements map.`);
        }
        return def;
    }

    /**
     * Resolve Locator by alias (self-heal aware + optional write-back).
     * Useful for expect() because it returns locator.
     */
    protected async resolveByAlias<A extends AliasMap, E extends Record<string, ElementDef>>(
        aliases: A,
        elements: E,
        aliasKey: keyof A
    ) {
        const elementKey = this.getElementKeyFromAlias(aliases, aliasKey);
        const def = this.getElementDefFromKey(elements, elementKey);
        return await this.resolveByKey(elementKey, def);
    }

    protected async clickByAlias<A extends AliasMap, E extends Record<string, ElementDef>>(
        aliases: A,
        elements: E,
        aliasKey: keyof A
    ) {
        const elementKey = this.getElementKeyFromAlias(aliases, aliasKey);
        const def = this.getElementDefFromKey(elements, elementKey);
        await this.clickByKey(elementKey, def);
    }

    protected async fillByAlias<A extends AliasMap, E extends Record<string, ElementDef>>(
        aliases: A,
        elements: E,
        aliasKey: keyof A,
        value: string
    ) {
        const elementKey = this.getElementKeyFromAlias(aliases, aliasKey);
        const def = this.getElementDefFromKey(elements, elementKey);
        await this.fillByKey(elementKey, def, value);
    }

    protected async typeByAlias<A extends AliasMap, E extends Record<string, ElementDef>>(
        aliases: A,
        elements: E,
        aliasKey: keyof A,
        value: string
    ) {
        const elementKey = this.getElementKeyFromAlias(aliases, aliasKey);
        const def = this.getElementDefFromKey(elements, elementKey);
        await this.typeByKey(elementKey, def, value);
    }

    protected async selectOptionByAlias<A extends AliasMap, E extends Record<string, ElementDef>>(
        aliases: A,
        elements: E,
        aliasKey: keyof A,
        value: string
    ) {
        const elementKey = this.getElementKeyFromAlias(aliases, aliasKey);
        const def = this.getElementDefFromKey(elements, elementKey);
        await this.selectOptionByKey(elementKey, def, value);
    }
}