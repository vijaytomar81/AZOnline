// src/businessLayer/pageObjects/pageManager.ts
// AUTO-GENERATED from src/businessLayer/pageObjects/.manifest/

import type { Page } from "@playwright/test";
import { InsuranceTypeSelectionPage } from "@businessLayer/pageObjects/objects/athena/azonline/common/insurance-type-selection/InsuranceTypeSelectionPage";
import { LoginOrRegistrationPage } from "@businessLayer/pageObjects/objects/athena/azonline/common/login-or-registration/LoginOrRegistrationPage";
import { ManageCookiesPage } from "@businessLayer/pageObjects/objects/athena/azonline/common/manage-cookies/ManageCookiesPage";
import { PhDrivingLicenceDetailsPage } from "@businessLayer/pageObjects/objects/athena/azonline/motor/ph-driving-licence-details/PhDrivingLicenceDetailsPage";

type PageFactory<T> = () => T;

export class PageManager {
    private readonly cache = new Map<string, unknown>();

    constructor(private readonly page: Page) {}

    private get<T>(key: string, factory: PageFactory<T>): T {
        const existing = this.cache.get(key) as T | undefined;
        if (existing) return existing;
        const created = factory();
        this.cache.set(key, created);
        return created;
    }

    get common() {
        return {
            insuranceTypeSelection: this.get("common.insuranceTypeSelection", () => new InsuranceTypeSelectionPage(this.page)),
            loginOrRegistration: this.get("common.loginOrRegistration", () => new LoginOrRegistrationPage(this.page)),
            manageCookies: this.get("common.manageCookies", () => new ManageCookiesPage(this.page)),
        };
    }

    get motor() {
        return {
            phDrivingLicenceDetails: this.get("motor.phDrivingLicenceDetails", () => new PhDrivingLicenceDetailsPage(this.page)),
        };
    }

}
