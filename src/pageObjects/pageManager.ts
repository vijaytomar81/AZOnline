// src/pageObjects/pageManager.ts
// AUTO-GENERATED from src/pageObjects/.manifest/

import type { Page } from "@playwright/test";
import { InsuranceTypeSelectionPage } from "@pageObjectsObjects/athena/common/insurance-type-selection/InsuranceTypeSelectionPage";
import { LoginOrRegistrationPage } from "@pageObjectsObjects/athena/common/login-or-registration/LoginOrRegistrationPage";
import { ManageCookiesPage } from "@pageObjectsObjects/athena/common/manage-cookies/ManageCookiesPage";
import { PhDrivingLicenceDetailsPage } from "@pageObjectsObjects/athena/motor/ph-driving-licence-details/PhDrivingLicenceDetailsPage";

type PageFactory<T> = () => T;

export class PageManager {
    private readonly cache = new Map<string, unknown>();

    constructor(private readonly page: Page) {}

    private get<T>(key: string, factory: PageFactory<T>): T {
        const existing = this.cache.get(key) as T | undefined;

        if (existing) {
            return existing;
        }

        const created = factory();
        this.cache.set(key, created);
        return created;
    }

    get athena() {
        return {
            insuranceTypeSelection: this.get("athena.insuranceTypeSelection", () => new InsuranceTypeSelectionPage(this.page)),
            loginOrRegistration: this.get("athena.loginOrRegistration", () => new LoginOrRegistrationPage(this.page)),
            manageCookies: this.get("athena.manageCookies", () => new ManageCookiesPage(this.page)),
            phDrivingLicenceDetails: this.get("athena.phDrivingLicenceDetails", () => new PhDrivingLicenceDetailsPage(this.page)),
        };
    }

}
