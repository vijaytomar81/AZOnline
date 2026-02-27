// src/pages/common/insurance-product-type-selection/InsuranceProductTypeSelectionPage.ts

import { expect } from "@playwright/test";
import type { Page } from "@playwright/test";

import { BasePage } from "../../core/BasePage";
import { elements, type ElementKey } from "./elements";

const PAGE_KEY = "common.insurance-product-type-selection" as const;

/**
 * Next-page URL patterns (dynamic id at end, optional query params).
 * We use these ONLY to confirm navigation (not to drive navigation).
 */
const MOTOR_CAR_DETAILS_URL_RE =
    /\/journey\/show\/product\/AnnualMotorInsurance\/process\/nb\/numberPlateScan\/[a-z0-9]+(?:\?.*)?$/i;

const HOME_PROPERTY_DETAILS_URL_RE =
    /\/journey\/show\/product\/AnnualHomeInsurance\/process\/nb\/propertyDetails\/[a-z0-9]+(?:\?.*)?$/i;

export class InsuranceProductTypeSelectionPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    /**
     * Stable load anchors:
     * - Car quote button (or link)
     * - Home quote button (or link)
     */
    async waitForLoaded() {
        // Don’t overfit URL here (this page could be reached from multiple places)
        await expect(this.elPreferred("carQuote")).toBeVisible({
            timeout: Number(process.env.ACTION_TIMEOUT ?? 20_000),
        });
        await expect(this.elPreferred("homeQuote")).toBeVisible({
            timeout: Number(process.env.ACTION_TIMEOUT ?? 20_000),
        });
    }

    /**
     * Preferred-only locator (good for expect()).
     * Actions should use clickByKey/fillByKey for self-heal.
     */
    private elPreferred<K extends ElementKey>(key: K) {
        return this.page.locator(elements[key].preferred);
    }

    // --- Key-aware actions (self-heal capable) ---

    async click<K extends ElementKey>(key: K) {
        await this.clickByKey(PAGE_KEY, String(key), elements[key]);
    }

    // --- Business actions ---

    /**
     * 1️⃣ Click Car Quote --> navigate to Motor Car Details
     */
    async chooseCarQuote() {
        // Some scans produce carQuote as link + also a button carQuote2.
        // Prefer the one with stable id (#viewSavedSubscriptionCarQuotes).
        await this.click("carQuote");

        await this.page.waitForURL(MOTOR_CAR_DETAILS_URL_RE, {
            timeout: Number(process.env.ACTION_TIMEOUT ?? 20_000),
        });
    }

    /**
     * 2️⃣ Click Home Quote --> navigate to Home Property Details
     */
    async chooseHomeQuote() {
        // Similar pattern: homeQuote may exist as link + button homeQuote2.
        await this.click("homeQuote");

        await this.page.waitForURL(HOME_PROPERTY_DETAILS_URL_RE, {
            timeout: Number(process.env.ACTION_TIMEOUT ?? 20_000),
        });
    }

    /**
     * 3️⃣ Click Back --> navigate back (AuthEntry).
     * We avoid guessing the URL here (safer across envs).
     * Your flow should call AuthEntryPage.waitForLoaded() after this.
     */
    async goBack() {
        // There are multiple back keys (back/back2/back3/back4).
        // Use the most stable one first.
        if ("back4" in elements) {
            await this.click("back4" as ElementKey);
        } else if ("back" in elements) {
            await this.click("back" as ElementKey);
        } else if ("back2" in elements) {
            await this.click("back2" as ElementKey);
        } else {
            await this.click("back3" as ElementKey);
        }

        // Basic navigation settle (avoid flakiness)
        await this.page.waitForLoadState("domcontentloaded", {
            timeout: Number(process.env.ACTION_TIMEOUT ?? 20_000),
        });
    }
}