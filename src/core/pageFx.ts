// src/core/pageFx.ts
import type { Page } from "@playwright/test";
import { LocatorEngine, type LocatorEngineOptions, type ElementDef } from "./locatorEngine";

export type ResolveKeyResult = {
    locator: ReturnType<Page["locator"]>;
    used: string;
    pageKey: string;
    elementKey: string;
};

export class PageFx {
    public readonly page: Page;
    public readonly engine: LocatorEngine;

    constructor(page: Page, opts: LocatorEngineOptions = {}) {
        this.page = page;
        this.engine = new LocatorEngine(page, { prefix: "[pw]", ...opts });
    }

    locator(def: ElementDef) {
        return this.engine.locator(def);
    }

    resolve(def: ElementDef) {
        return this.engine.resolve(def);
    }

    /**
     * Key-aware resolve: returns pageKey + elementKey so BasePage can persist self-heal
     * when a fallback becomes preferred.
     */
    async resolveKey(pageKey: string, elementKey: string, def: ElementDef): Promise<ResolveKeyResult> {
        const res = await this.engine.resolve(def);
        return { ...res, pageKey, elementKey };
    }

    async click(def: ElementDef) {
        return this.engine.click(def);
    }

    async fill(def: ElementDef, value: string) {
        return this.engine.fill(def, value);
    }

    async type(def: ElementDef, value: string) {
        return this.engine.type(def, value);
    }

    async selectOption(def: ElementDef, value: string) {
        return this.engine.selectOption(def, value);
    }

    async isVisible(def: ElementDef) {
        return this.engine.isVisible(def);
    }
}