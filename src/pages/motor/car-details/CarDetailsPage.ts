// src/pages/motor/car-details/CarDetailsPage.ts

import { expect } from "@playwright/test";
import type { Page } from "@playwright/test";

import { BasePage } from "../../core/BasePage"; // adjust if needed
import { elements, type ElementKey } from "./elements";

const PAGE_KEY = "motor.car-details" as const;

// Dynamic id at end changes each run
const CAR_DETAILS_URL_RE =
    /\/journey\/show\/product\/AnnualMotorInsurance\/process\/nb\/numberPlateScan\/[a-z0-9]+/i;

export class CarDetailsPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    /**
     * Arrive here via navigation (from InsuranceProductTypeSelectionPage).
     * This page is step-based:
     *   Step 1: Yes/No question appears
     *   Step 2: If Yes, registration input appears
     *
     * So enterprise anchor = YES/NO buttons (always visible on load).
     */
    async waitForLoaded() {
        await this.page.waitForURL(CAR_DETAILS_URL_RE, {
            timeout: Number(process.env.ACTION_TIMEOUT ?? 20_000),
        });

        // Step-1 anchors (match your screenshot)
        await expect(this.elPreferred("yes")).toBeVisible({
            timeout: Number(process.env.ACTION_TIMEOUT ?? 20_000),
        });
        await expect(this.elPreferred("no")).toBeVisible({
            timeout: Number(process.env.ACTION_TIMEOUT ?? 20_000),
        });
    }

    /**
     * Preferred-only locator accessor (good for quick expect()).
     * Actions should use clickByKey/fillByKey/etc (self-heal aware).
     */
    private elPreferred<K extends ElementKey>(key: K) {
        return this.page.locator(elements[key].preferred);
    }

    // --- Key-aware actions (self-heal capable) ---

    async click<K extends ElementKey>(key: K) {
        await this.clickByKey(PAGE_KEY, String(key), elements[key]);
    }

    async fill<K extends ElementKey>(key: K, value: string) {
        await this.fillByKey(PAGE_KEY, String(key), elements[key], value);
    }

    async selectOption<K extends ElementKey>(key: K, value: string) {
        await this.selectOptionByKey(PAGE_KEY, String(key), elements[key], value);
    }

    // --- Business actions (enterprise names) ---

    async selectKnowRegistrationYes() {
        await this.click("yes");

        // Registration field should now appear (Step-2)
        await expect(this.elPreferred("whatSYourCarRegistrationNumber")).toBeVisible({
            timeout: Number(process.env.ACTION_TIMEOUT ?? 20_000),
        });
    }

    async selectKnowRegistrationNo() {
        await this.click("no");
        // If selecting No reveals different fields later, we’ll add those asserts then.
    }

    async setRegistrationNumber(vrn: string) {
        await this.fill("whatSYourCarRegistrationNumber", vrn);
    }

    async clickFindMyCar() {
        await this.click("findMyCar");
    }

    /**
     * Purchase date: month/year inputs (MM + YYYY)
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
        // Some journeys have both vehicle-model and shortened-model
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

    async toggleNotBoughtYet() {
        await this.click("theCarHasnTBeenBoughtYet");
    }

    async goNext() {
        await this.click("next");
    }

    async goBack() {
        await this.click("back");
    }
}