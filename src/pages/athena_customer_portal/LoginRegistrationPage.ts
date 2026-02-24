// src/pages/athena_customer_portal/LoginRegistrationPage.ts
import { expect } from "@playwright/test";
import type { Page, Locator } from "@playwright/test";

export class LoginRegistrationPage {
    readonly page: Page;

    // main page
    readonly loginButton: Locator;
    readonly registerButton: Locator;
    readonly skipRegisterLaterLink: Locator;

    // cookie modal
    readonly cookieAcceptAll: Locator;
    readonly cookieRejectAll: Locator;
    readonly cookieModal: Locator;

    constructor(page: Page) {
        this.page = page;

        // ✅ main elements (use IDs if they exist in your DOM)
        this.loginButton = page.locator("#login");
        this.registerButton = page.locator("#register");
        this.skipRegisterLaterLink = page.locator("#skipRegistration");

        // ✅ cookie modal selectors (text-based, resilient)
        this.cookieModal = page.locator("text=We use cookies on our website").first();
        this.cookieAcceptAll = page.getByRole("button", { name: /accept all/i });
        this.cookieRejectAll = page.getByRole("button", { name: /reject all/i });
    }

    async goto(urlOrPath: string = "/") {
        await this.page.goto(urlOrPath, { waitUntil: "domcontentloaded" });
    }

    async handleCookies() {
        // If modal appears, close it. If not, do nothing.
        if (await this.cookieAcceptAll.isVisible().catch(() => false)) {
            await this.cookieAcceptAll.click();
            // wait until modal disappears
            await expect(this.cookieAcceptAll).toBeHidden({ timeout: 10_000 });
        }
    }

    async assertVisible() {
        await this.handleCookies();

        await expect(this.loginButton).toBeVisible();
        await expect(this.registerButton).toBeVisible();
        await expect(this.skipRegisterLaterLink).toBeVisible();
    }
}