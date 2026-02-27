// src/pages/common/BasePage.ts
import type { Page } from "@playwright/test";
import { PageFx } from "../../core/pageFx";
import { CookieBanner } from "./CookieBanner";
import { SelfHealWriter } from "../../scanner/selfHealWriter";
import type { ElementDef } from "../../core/locatorEngine";

export type BasePageOptions = {
    verboseEngine?: boolean;
    selfHeal?: boolean;
    actionTimeoutMs?: number;

    // cookie behavior
    autoAcceptCookies?: boolean; // default true
    autoRejectCookies?: boolean; // default false
};

export abstract class BasePage {
    protected readonly page: Page;
    protected readonly fx: PageFx;
    protected readonly cookies: CookieBanner;

    // persistent self-heal (optional)
    private readonly healWriter: SelfHealWriter;
    private readonly healWriteEnabled: boolean;

    // cookie switches
    private readonly _autoAccept: boolean;
    private readonly _autoReject: boolean;

    constructor(page: Page, opts: BasePageOptions = {}) {
        this.page = page;

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
                // That happens when pages use resolveByKey/clickByKey/fillByKey.
                // So this callback exists mainly for runtime logs.
                // Persistent writing is done inside resolveByKey() below.
                void preferredWas;
                void preferredNow;
            },
        });

        this.cookies = new CookieBanner(page);

        // defaults
        this._autoAccept = opts.autoAcceptCookies ?? process.env.AUTO_ACCEPT_COOKIES !== "false";
        this._autoReject = opts.autoRejectCookies ?? process.env.AUTO_REJECT_COOKIES === "true";
    }

    async goto(url: string) {
        await this.page.goto(url, { waitUntil: "domcontentloaded" });

        // handle cookie banner safely
        if (this._autoReject) {
            await this.cookies.rejectIfVisible();
        } else if (this._autoAccept) {
            await this.cookies.acceptIfVisible();
        }
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

    protected async resolveByKey(pageKey: string, elementKey: string, def: ElementDef) {
        const beforePreferred = def.preferred;
        const res = await this.fx.resolveKey(pageKey, elementKey, def);

        // If runtime selfHeal promoted fallback -> preferred, def.preferred will change.
        // Persist that change when enabled.
        if (this.healWriteEnabled && def.preferred !== beforePreferred) {
            this.healWriter.apply({
                pageKey,
                elementKey,
                preferredWas: beforePreferred,
                preferredNow: def.preferred,
            });
        }

        return res;
    }

    protected async clickByKey(pageKey: string, elementKey: string, def: ElementDef) {
        const { locator } = await this.resolveByKey(pageKey, elementKey, def);
        await locator.click({ timeout: Number(process.env.ACTION_TIMEOUT ?? 10_000) });
    }

    protected async fillByKey(pageKey: string, elementKey: string, def: ElementDef, value: string) {
        const { locator } = await this.resolveByKey(pageKey, elementKey, def);
        await locator.fill(value, { timeout: Number(process.env.ACTION_TIMEOUT ?? 10_000) });
    }

    protected async typeByKey(pageKey: string, elementKey: string, def: ElementDef, value: string) {
        const { locator } = await this.resolveByKey(pageKey, elementKey, def);
        await locator.type(value, { timeout: Number(process.env.ACTION_TIMEOUT ?? 10_000) });
    }

    protected async selectOptionByKey(pageKey: string, elementKey: string, def: ElementDef, value: string) {
        const { locator } = await this.resolveByKey(pageKey, elementKey, def);
        await locator.selectOption(value, { timeout: Number(process.env.ACTION_TIMEOUT ?? 10_000) });
    }
}