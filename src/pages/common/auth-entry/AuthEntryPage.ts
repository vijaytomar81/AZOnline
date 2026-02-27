import { expect, type Page } from "@playwright/test";
import { BasePage } from "../../core/BasePage";
import { elements } from "./elements";

/**
 * Auth Entry / Landing page
 * Enterprise business page object
 */
export class AuthEntryPage extends BasePage {
    private static readonly PAGE_KEY = "common.auth-entry";

    constructor(page: Page) {
        super(page);
    }

    async open(url: string) {
        await this.goto(url);
        await this.assertLoaded();
    }

    /**
     * Page readiness assertion
     */
    async assertLoaded() {
        const login = await this.resolveByKey(
            AuthEntryPage.PAGE_KEY,
            "logIn",
            elements.logIn
        );

        const register = await this.resolveByKey(
            AuthEntryPage.PAGE_KEY,
            "register",
            elements.register
        );

        const skip = await this.resolveByKey(
            AuthEntryPage.PAGE_KEY,
            "skipThisStepILlRegisterLater",
            elements.skipThisStepILlRegisterLater
        );

        await expect(login.locator).toBeVisible();
        await expect(register.locator).toBeVisible();
        await expect(skip.locator).toBeVisible();
    }

    // ===== BUSINESS ACTIONS =====

    async clickLogin() {
        await this.clickByKey(
            AuthEntryPage.PAGE_KEY,
            "logIn",
            elements.logIn
        );
    }

    async clickRegister() {
        await this.clickByKey(
            AuthEntryPage.PAGE_KEY,
            "register",
            elements.register
        );
    }

    async clickSkipRegisterLater() {
        await this.clickByKey(
            AuthEntryPage.PAGE_KEY,
            "skipThisStepILlRegisterLater",
            elements.skipThisStepILlRegisterLater
        );
    }
}