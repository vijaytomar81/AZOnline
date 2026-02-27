import { expect, type Page } from "@playwright/test";
import { BasePage } from "../../core/BasePage";
import { elements } from "./elements";

/**
 * Insurance Product Type Selection page
 *
 * Business actions:
 *  - Choose Car Quote  -> navigates to Motor flow (Car Details page)
 *  - Choose Home Quote -> navigates to Home flow
 *  - Back             -> returns to Auth Entry
 */
export class InsuranceProductTypeSelectionPage extends BasePage {
    private static readonly PAGE_KEY = "common.insurance-product-type-selection";

    constructor(page: Page) {
        super(page);
    }

    async assertLoaded() {
        // Use stable business signals only (ignore cookie noise keys)
        const carQuote = await this.resolveByKey(
            InsuranceProductTypeSelectionPage.PAGE_KEY,
            "carQuote",
            elements.carQuote
        );

        const homeQuote = await this.resolveByKey(
            InsuranceProductTypeSelectionPage.PAGE_KEY,
            "homeQuote",
            elements.homeQuote
        );

        await expect(carQuote.locator).toBeVisible();
        await expect(homeQuote.locator).toBeVisible();
    }

    // ---------- Business actions ----------

    /**
     * Click "Car quote" and wait for navigation to Motor journey.
     * We don't hardcode the full URL because journey id is dynamic.
     * We assert that URL contains "/journey/show/product/" which is stable.
     */
    async chooseCarQuote() {
        await this.clickByKey(
            InsuranceProductTypeSelectionPage.PAGE_KEY,
            "carQuote",
            elements.carQuote
        );

        await this.page.waitForURL(/\/journey\/show\/product\//i, {
            timeout: Number(process.env.ACTION_TIMEOUT ?? 20_000),
        });
    }

    /**
     * Click "Home quote" and wait for navigation.
     * Adjust the URL match later once you confirm the Home journey path.
     */
    async chooseHomeQuote() {
        await this.clickByKey(
            InsuranceProductTypeSelectionPage.PAGE_KEY,
            "homeQuote",
            elements.homeQuote
        );

        // placeholder match: change to your stable home journey route once confirmed
        await this.page.waitForURL(/home/i, {
            timeout: Number(process.env.ACTION_TIMEOUT ?? 20_000),
        });
    }

    /**
     * Back to Auth Entry.
     * You have multiple back keys; pick the most stable one.
     * Prefer the "back4" aria-label Back button if it's consistently present.
     */
    async backToAuthEntry() {
        // Try the best/stablest "Back" candidate first (aria-label Back)
        await this.clickByKey(
            InsuranceProductTypeSelectionPage.PAGE_KEY,
            "back4",
            elements.back4
        );

        // Auth entry is typically the root/landing (URL varies); we just wait for load.
        await this.page.waitForLoadState("domcontentloaded");
    }
}