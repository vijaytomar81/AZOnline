// src/core/locatorEngine.ts
import type { Page, Locator } from "@playwright/test";

export type ElementDef = {
    type: string;
    preferred: string;
    fallbacks: string[];
};

export type LocatorEngineOptions = {
    timeoutMs?: number;        // per action timeout
    verbose?: boolean;         // logs all attempts
    selfHeal?: boolean;        // promote working fallback (runtime only)
    prefix?: string;           // log prefix
    onHealed?: (info: { preferredWas: string; preferredNow: string }) => void;
};

function nowIso() {
    return new Date().toISOString();
}

function escapeNewlines(s: string) {
    return s.replace(/\r?\n/g, " ");
}

export class LocatorEngine {
    private page: Page;
    private timeoutMs: number;
    private verbose: boolean;
    private selfHeal: boolean;
    private prefix: string;
    private onHealed?: LocatorEngineOptions["onHealed"];

    constructor(page: Page, opts: LocatorEngineOptions = {}) {
        this.page = page;
        this.timeoutMs = opts.timeoutMs ?? 10_000;
        this.verbose = !!opts.verbose;
        this.selfHeal = !!opts.selfHeal;
        this.prefix = opts.prefix ?? "[engine]";
        this.onHealed = opts.onHealed;
    }

    private log(msg: string) {
        // Keep console logging minimal; can be wired to your logger later
        // eslint-disable-next-line no-console
        console.log(`${nowIso()} ${this.prefix} ${msg}`);
    }

    locator(def: ElementDef): Locator {
        // Fast path: preferred locator only.
        // Use engine.click/fill/etc for fallback behavior.
        return this.page.locator(def.preferred);
    }

    private selectors(def: ElementDef): string[] {
        return [def.preferred, ...(def.fallbacks ?? [])].filter(Boolean);
    }

    async resolve(def: ElementDef): Promise<{ locator: Locator; used: string }> {
        const selectors = this.selectors(def);
        let lastErr: unknown = null;

        for (let i = 0; i < selectors.length; i++) {
            const sel = selectors[i];
            try {
                const loc = this.page.locator(sel).first();

                // "attached" check is fast and reliable for existence
                await loc.waitFor({ state: "attached", timeout: this.timeoutMs });

                if (this.verbose) this.log(`resolve OK: ${sel}`);

                // runtime self-heal: promote successful fallback to preferred
                if (this.selfHeal && i > 0) {
                    const was = def.preferred;
                    def.preferred = sel;
                    def.fallbacks = selectors.filter((s) => s !== sel);

                    this.onHealed?.({ preferredWas: was, preferredNow: sel });

                    if (this.verbose) this.log(`selfHeal promoted: ${was} -> ${sel}`);
                }

                return { locator: loc, used: sel };
            } catch (e) {
                lastErr = e;
                if (this.verbose) this.log(`resolve failed: ${sel} (${escapeNewlines(String(e))})`);
            }
        }

        throw new Error(
            `Unable to resolve element. Tried preferred+fallbacks.\nPreferred: ${def.preferred}\nFallbacks: ${(def.fallbacks ?? []).join(
                ", "
            )}\nLast error: ${String(lastErr)}`
        );
    }

    async click(def: ElementDef) {
        const { locator, used } = await this.resolve(def);
        if (this.verbose) this.log(`click using: ${used}`);
        await locator.click({ timeout: this.timeoutMs });
    }

    async fill(def: ElementDef, value: string) {
        const { locator, used } = await this.resolve(def);
        if (this.verbose) this.log(`fill using: ${used}`);
        await locator.fill(value, { timeout: this.timeoutMs });
    }

    async type(def: ElementDef, value: string) {
        const { locator, used } = await this.resolve(def);
        if (this.verbose) this.log(`type using: ${used}`);
        await locator.type(value, { timeout: this.timeoutMs });
    }

    async selectOption(def: ElementDef, value: string) {
        const { locator, used } = await this.resolve(def);
        if (this.verbose) this.log(`selectOption using: ${used}`);
        await locator.selectOption(value, { timeout: this.timeoutMs });
    }

    async isVisible(def: ElementDef): Promise<boolean> {
        const selectors = this.selectors(def);
        for (const sel of selectors) {
            try {
                const loc = this.page.locator(sel).first();
                return await loc.isVisible({ timeout: this.timeoutMs });
            } catch {
                // try next selector
            }
        }
        return false;
    }
}