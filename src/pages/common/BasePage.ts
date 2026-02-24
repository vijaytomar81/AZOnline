// src/pages/common/BasePage.ts
import { expect } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";
import { CookieBanner } from "./CookieBanner";

/**
 * Enterprise BasePage
 * - Central place for navigation, waits, cookie handling
 * - Keeps individual pages clean + consistent
 */
export abstract class BasePage {
    protected readonly page: Page;

    /** Turn cookie handling on/off globally via env var if needed */
    private readonly autoHandleCookies: boolean;

    constructor(page: Page) {
        this.page = page;

        // Default: true. You can disable via: $env:AUTO_COOKIES="false"
        this.autoHandleCookies = process.env.AUTO_COOKIES === "false" ? false : true;
    }

    /**
     * Navigate to absolute URL or relative path.
     * If you pass "/path", it uses Playwright baseURL automatically.
     */
    async goto(urlOrPath: string, waitUntil: "domcontentloaded" | "load" | "networkidle" = "domcontentloaded") {
        await this.page.goto(urlOrPath, { waitUntil });

        if (this.autoHandleCookies) {
            // Accept cookie banner if it appears
            await new CookieBanner(this.page).acceptIfVisible();
        }
    }

    /** Useful generic helpers */
    async click(locator: Locator) {
        await expect(locator).toBeVisible();
        await locator.click();
    }

    async fill(locator: Locator, value: string) {
        await expect(locator).toBeVisible();
        await locator.fill(value);
    }

    async expectVisible(locator: Locator) {
        await expect(locator).toBeVisible();
    }

    async expectHidden(locator: Locator) {
        await expect(locator).toBeHidden();
    }

    /** Sometimes pages have spinners / overlays — you can standardize it here later */
    async waitForStableUi(timeoutMs = 10_000) {
        // minimal default: ensure DOM ready
        await this.page.waitForLoadState("domcontentloaded", { timeout: timeoutMs });
    }
}