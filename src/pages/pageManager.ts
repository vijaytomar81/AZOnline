// src/pages/pageManager.ts
import type { Page } from "@playwright/test";
import { InsuranceTypeSelectionPage } from "@page-objects/athena/common/insurance-type-selection/InsuranceTypeSelectionPage";
import { LoginOrRegistrationPage } from "@page-objects/athena/common/login-or-registration/LoginOrRegistrationPage";
import { PhDrivingLicenceDetailsPage } from "@page-objects/athena/motor/ph-driving-licence-details/PhDrivingLicenceDetailsPage";



/**
 * Enterprise PageManager / Factory
 * - Single place to construct Page Objects
 * - Prevents import duplication across tests/flows
 * - Keeps everything strongly typed
 */
export class PageManager {
    readonly page: Page;

    // Lazy cache (each page object is created only once per test)
    private cache = new Map<string, any>();

    constructor(page: Page) {
        this.page = page;
    }

    /** Create/get cached instance by key */
    private get<T>(key: string, factory: () => T): T {
        if (!this.cache.has(key)) {
            this.cache.set(key, factory());
        }
        return this.cache.get(key) as T;
    }

    get athena() {
        return {
            insuranceTypeSelection: this.get("athena.insuranceTypeSelection", () => new InsuranceTypeSelectionPage(this.page)),
            loginOrRegistration: this.get("athena.loginOrRegistration", () => new LoginOrRegistrationPage(this.page)),
            phDrivingLicenceDetails: this.get("athena.phDrivingLicenceDetails", () => new PhDrivingLicenceDetailsPage(this.page)),
        };
    }

}
