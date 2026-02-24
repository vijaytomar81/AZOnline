// src/pages/common/CookieBanner.ts
import { expect, type Locator, type Page } from "@playwright/test";

/**
 * Cookie banner handler (reusable across projects).
 * Safe: does nothing if banner isn't present.
 */
export class CookieBanner {
    private readonly page: Page;

    // Prefer role-based selectors (works across UI refactors)
    private readonly acceptAllBtn: Locator;
    private readonly rejectAllBtn: Locator;

    constructor(page: Page) {
        this.page = page;

        this.acceptAllBtn = page.getByRole("button", { name: /accept all/i });
        this.rejectAllBtn = page.getByRole("button", { name: /reject all/i });
    }

    async acceptIfVisible(timeoutMs = 3000): Promise<boolean> {
        // If banner appears, accept it; otherwise no-op.
        try {
            if (await this.acceptAllBtn.isVisible({ timeout: timeoutMs })) {
                await this.acceptAllBtn.click();
                await expect(this.acceptAllBtn).toBeHidden({ timeout: 10_000 });
                return true;
            }
        } catch {
            // ignore
        }
        return false;
    }

    async rejectIfVisible(timeoutMs = 3000): Promise<boolean> {
        try {
            if (await this.rejectAllBtn.isVisible({ timeout: timeoutMs })) {
                await this.rejectAllBtn.click();
                await expect(this.rejectAllBtn).toBeHidden({ timeout: 10_000 });
                return true;
            }
        } catch {
            // ignore
        }
        return false;
    }
}