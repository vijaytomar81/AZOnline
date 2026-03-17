// src/pages/pageManager.ts
// AUTO-GENERATED from src/pages/.manifest/

import type { Page } from "@playwright/test";
import { InsuranceTypeSelectionPage } from "@page-objects/athena/common/insurance-type-selection/InsuranceTypeSelectionPage";
import { LoginOrRegistrationPage } from "@page-objects/athena/common/login-or-registration/LoginOrRegistrationPage";
import { PhDrivingLicenceDetailsPage } from "@page-objects/athena/motor/ph-driving-licence-details/PhDrivingLicenceDetailsPage";

type PageFactory<T> = () => T;

export class PageManager {
    constructor(private readonly page: Page) {}

    private get<T>(_key: string, factory: PageFactory<T>): T {
        return factory();
    }

    get athena() {
        return {
            insuranceTypeSelection: this.get("athena.insuranceTypeSelection", () => new InsuranceTypeSelectionPage(this.page)),
            loginOrRegistration: this.get("athena.loginOrRegistration", () => new LoginOrRegistrationPage(this.page)),
            phDrivingLicenceDetails: this.get("athena.phDrivingLicenceDetails", () => new PhDrivingLicenceDetailsPage(this.page)),
        };
    }

}
