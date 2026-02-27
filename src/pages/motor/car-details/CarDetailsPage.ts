// src/pages/motor/car-details/CarDetailsPage.ts

import { expect } from "@playwright/test";
import type { Page } from "@playwright/test";

import { BasePage } from "../../core/BasePage"; // ✅ adjust if your BasePage lives elsewhere
import { elements, type ElementKey } from "./elements";

const PAGE_KEY = "motor.car-details" as const;

// Journey URL pattern (dynamic id at end, ignore it)
const CAR_DETAILS_URL_RE = /\/journey\/show\/product\/AnnualMotorInsurance\/process\/nb\/numberPlateScan\/[a-z0-9]+/i;

export class CarDetailsPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    /**
     * Optional: use this when you arrive here from previous page via navigation.
     * It waits for the URL pattern and a key element to exist.
     */
    async waitForLoaded() {
        await this.page.waitForURL(CAR_DETAILS_URL_RE, {
            timeout: Number(process.env.ACTION_TIMEOUT ?? 20_000),
        });

        // A stable element on this page (adjust if needed)
        await expect(this.el("whatSYourCarRegistrationNumber")).toBeVisible({
            timeout: Number(process.env.ACTION_TIMEOUT ?? 20_000),
        });
    }

    /**
     * Enterprise locator accessor:
     * Uses BasePage->PageFx->self-heal engine (preferred + fallbacks).
     */
    private el<K extends ElementKey>(key: K) {
        // We call resolveByKey so self-heal can be persisted (if enabled).
        // But we also want an ergonomic Locator for asserts.
        return this.page.locator(elements[key].preferred);
    }

    // --- Key-aware actions (these enable persistent self-heal) ---

    async click<K extends ElementKey>(key: K) {
        await this.clickByKey(PAGE_KEY, String(key), elements[key]);
    }

    async fill<K extends ElementKey>(key: K, value: string) {
        await this.fillByKey(PAGE_KEY, String(key), elements[key], value);
    }

    async selectOption<K extends ElementKey>(key: K, value: string) {
        await this.selectOptionByKey(PAGE_KEY, String(key), elements[key], value);
    }

    // --- Business actions ---

    async setRegistrationNumber(vrn: string) {
        await this.fill("whatSYourCarRegistrationNumber", vrn);
    }

    async clickFindMyCar() {
        await this.click("findMyCar");
    }

    /**
     * Purchase date: month/year inputs.
     * Supports MM + YYYY (e.g., "02", "2024").
     */
    async setPurchaseDate(monthMM: string, yearYYYY: string) {
        await this.fill("purchaseMonthInputField", monthMM);
        await this.fill("purchaseYearInputField", yearYYYY);
    }

    async setTransmission(type: "manual" | "automatic") {
        if (type === "manual") await this.click("manual");
        else await this.click("automatic");
    }

    async setFuelType(type: "petrol" | "diesel") {
        if (type === "petrol") await this.click("petrol");
        else await this.click("diesel");
    }

    async setVehicleMake(make: string) {
        await this.fill("startTypingTheMakeOfYourVehicle", make);
    }

    async setVehicleModel(model: string) {
        // Some pages have both vehicle-model and shortened-model.
        // Prefer the primary if present; fallback to the alternative key.
        try {
            await this.fill("startTypingTheModelNameOfYourVehicle2", model);
        } catch {
            await this.fill("startTypingTheModelNameOfYourVehicle", model);
        }
    }

    async setVehicleManufactureYear(year: string) {
        await this.selectOption("vehicleManufactureYear", year);
    }

    async setVehicleDoors(count: string) {
        await this.selectOption("vehicleDoors", count);
    }

    /**
     * "The car hasn't been bought yet" checkbox
     */
    async toggleNotBoughtYet() {
        await this.click("theCarHasnTBeenBoughtYet");
    }

    async goNext() {
        await this.click("next");
    }

    async goBack() {
        // prefer back (has more fallbacks)
        await this.click("back");
    }
}