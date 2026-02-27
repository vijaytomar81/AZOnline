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
     * Step-1 anchor on first load is "Do you know the registration number?" Yes/No.
     */
    async waitForLoaded() {
        await this.page.waitForURL(CAR_DETAILS_URL_RE, {
            timeout: Number(process.env.ACTION_TIMEOUT ?? 20_000),
        });

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

    /**
     * Step-1: "Do you know the registration number of the car?"
     */
    async answerKnowRegistration(know: boolean) {
        await this.click(know ? "yes" : "no");

        // If "Yes", the VRN input appears in the next step.
        if (know) {
            await expect(this.elPreferred("whatSYourCarRegistrationNumber")).toBeVisible({
                timeout: Number(process.env.ACTION_TIMEOUT ?? 20_000),
            });
        }
    }

    async setRegistrationNumber(vrn: string) {
        await this.fill("whatSYourCarRegistrationNumber", vrn);
    }

    /**
     * Triggers lookup and transitions page into the "vehicle found" state
     * where the two Yes/No question groups appear (details correct + modifications).
     */
    async findMyCarAndWaitForVehicleSummary() {
        await this.click("findMyCar");

        // After lookup, these questions should appear (your screenshot).
        // We wait for modifications question group anchor, because it indicates the new state is rendered.
        await expect(this.elPreferred("yes2")).toBeVisible({
            timeout: Number(process.env.ACTION_TIMEOUT ?? 30_000),
        });
        await expect(this.elPreferred("no2")).toBeVisible({
            timeout: Number(process.env.ACTION_TIMEOUT ?? 30_000),
        });
    }

    /**
     * Post-VRN lookup question #1:
     * "Are the above vehicle details correct?"
     *
     * NOTE: your generator named them "yes"/"no" too, which collides with Step-1 meaning.
     * But for THIS question, the fallbacks include the real IDs:
     * - #vehicleDetailsSetCorrectly-true
     * - #vehicleDetailsSetCorrectly-false
     *
     * So we still call click("yes"/"no") BUT ONLY AFTER you are in the post-lookup state.
     */
    async confirmVehicleDetailsCorrect(isCorrect: boolean) {
        await this.click(isCorrect ? "yes" : "no");
    }

    /**
     * Post-VRN lookup question #2:
     * "Does this car have any modifications...?"
     */
    async setHasModifications(hasMods: boolean) {
        await this.click(hasMods ? "yes2" : "no2");
    }

    /**
     * Purchase date: month/year inputs (MM + YYYY)
     * (Used when you are manually editing details; may not appear in the lookup state.)
     */
    async setPurchaseDate(monthMM: string, yearYYYY: string) {
        await this.fill("purchaseMonthInputField", monthMM);
        await this.fill("purchaseYearInputField", yearYYYY);
    }

    async setTransmission(type: "manual" | "automatic") {
        await this.click(type === "manual" ? "manual" : "automatic");
    }

    async setFuelType(type: "petrol" | "diesel") {
        await this.click(type === "petrol" ? "petrol" : "diesel");
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

    /**
     * After answering post-lookup questions, Next becomes enabled.
     */
    async goNext() {
        await this.click("next");
    }

    async goBack() {
        await this.click("back");
    }
}