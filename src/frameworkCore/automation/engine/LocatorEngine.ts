// src/automation/engine/LocatorEngine.ts

import type { Locator, Page } from "@playwright/test";
import { createLogger } from "@utils/logger";
import type { Logger } from "@utils/logger";
import { escapeNewlines } from "@utils/text";
import type { ElementDef, LocatorEngineOptions } from "./types";

export class LocatorEngine {
    private readonly page: Page;
    private readonly timeoutMs: number;
    private readonly verbose: boolean;
    private readonly selfHeal: boolean;
    private readonly onHealed?: LocatorEngineOptions["onHealed"];
    private readonly logRef: Logger;

    constructor(page: Page, opts: LocatorEngineOptions = {}) {
        this.page = page;
        this.timeoutMs = opts.timeoutMs ?? 10_000;
        this.verbose = !!opts.verbose;
        this.selfHeal = !!opts.selfHeal;
        this.onHealed = opts.onHealed;

        this.logRef = createLogger({
            prefix: opts.prefix ?? "[engine]",
            logLevel: this.verbose ? "debug" : "info",
            withTimestamp: true,
            logToFile: false,
        });
    }

    private log(message: string): void {
        this.logRef.info(message);
    }

    locator(def: ElementDef): Locator {
        return this.page.locator(def.preferred);
    }

    private selectors(def: ElementDef): string[] {
        return [def.preferred, ...(def.fallbacks ?? [])].filter(Boolean);
    }

    async resolve(def: ElementDef): Promise<{ locator: Locator; used: string }> {
        const selectors = this.selectors(def);
        let lastError: unknown = null;

        for (let index = 0; index < selectors.length; index++) {
            const selector = selectors[index];

            try {
                const locator = this.page.locator(selector).first();
                await locator.waitFor({
                    state: "attached",
                    timeout: this.timeoutMs,
                });

                if (this.verbose) {
                    this.log(`resolve OK: ${selector}`);
                }

                if (this.selfHeal && index > 0) {
                    const preferredWas = def.preferred;
                    def.preferred = selector;
                    def.fallbacks = selectors.filter((item) => item !== selector);

                    this.onHealed?.({
                        preferredWas,
                        preferredNow: selector,
                    });

                    if (this.verbose) {
                        this.log(`selfHeal promoted: ${preferredWas} -> ${selector}`);
                    }
                }

                return { locator, used: selector };
            } catch (error) {
                lastError = error;

                if (this.verbose) {
                    this.log(
                        `resolve failed: ${selector} (${escapeNewlines(String(error))})`
                    );
                }
            }
        }

        throw new Error(
            `Unable to resolve element. Tried preferred+fallbacks.\n` +
            `Preferred: ${def.preferred}\n` +
            `Fallbacks: ${(def.fallbacks ?? []).join(", ")}\n` +
            `Last error: ${String(lastError)}`
        );
    }

    async click(def: ElementDef): Promise<void> {
        const { locator, used } = await this.resolve(def);

        if (this.verbose) {
            this.log(`click using: ${used}`);
        }

        await locator.click({ timeout: this.timeoutMs });
    }

    async fill(def: ElementDef, value: string): Promise<void> {
        const { locator, used } = await this.resolve(def);

        if (this.verbose) {
            this.log(`fill using: ${used}`);
        }

        await locator.fill(value, { timeout: this.timeoutMs });
    }

    async type(def: ElementDef, value: string): Promise<void> {
        const { locator, used } = await this.resolve(def);

        if (this.verbose) {
            this.log(`type using: ${used}`);
        }

        await locator.type(value, { timeout: this.timeoutMs });
    }

    async selectOption(def: ElementDef, value: string): Promise<void> {
        const { locator, used } = await this.resolve(def);

        if (this.verbose) {
            this.log(`selectOption using: ${used}`);
        }

        await locator.selectOption(value, { timeout: this.timeoutMs });
    }

    async isVisible(def: ElementDef): Promise<boolean> {
        for (const selector of this.selectors(def)) {
            try {
                const locator = this.page.locator(selector).first();
                return await locator.isVisible({ timeout: this.timeoutMs });
            } catch {
                // try next selector
            }
        }

        return false;
    }
}