// src/frameworkCore/automation/engine/PageFx.ts

import type { Page } from "@playwright/test";
import { LocatorEngine } from "./LocatorEngine";
import type {
    ElementDef,
    LocatorEngineOptions,
    ResolveKeyResult,
} from "./types";

export class PageFx {
    readonly page: Page;
    readonly engine: LocatorEngine;

    constructor(page: Page, opts: LocatorEngineOptions = {}) {
        this.page = page;
        this.engine = new LocatorEngine(page, {
            prefix: "[pw]",
            ...opts,
        });
    }

    locator(def: ElementDef) {
        return this.engine.locator(def);
    }

    resolve(def: ElementDef) {
        return this.engine.resolve(def);
    }

    async resolveKey(
        pageKey: string,
        elementKey: string,
        def: ElementDef
    ): Promise<ResolveKeyResult> {
        const result = await this.engine.resolve(def);

        return {
            ...result,
            pageKey,
            elementKey,
        };
    }

    async click(def: ElementDef): Promise<void> {
        await this.engine.click(def);
    }

    async fill(def: ElementDef, value: string): Promise<void> {
        await this.engine.fill(def, value);
    }

    async type(def: ElementDef, value: string): Promise<void> {
        await this.engine.type(def, value);
    }

    async selectOption(def: ElementDef, value: string): Promise<void> {
        await this.engine.selectOption(def, value);
    }

    async isVisible(def: ElementDef): Promise<boolean> {
        return await this.engine.isVisible(def);
    }
}