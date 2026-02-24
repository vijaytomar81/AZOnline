// src/pages/pageManager.ts
import type { Page } from "@playwright/test";

// Common
import { AuthEntryPage } from "./common/AuthEntryPage";

// Motor pages
import { InsuranceTypeSelectionPage } from "./motor/insurance-type-selection/InsuranceTypeSelectionPage";
import { CarDetailsPage } from "./motor/car-details/CarDetailsPage";
import { DrivingLicencePage } from "./motor/driving-licence/DrivingLicencePage";
import { PersonalDetailsPage } from "./motor/personal-details/PersonalDetailsPage";
import { ClaimsAndConvictionsPage } from "./motor/claims-and-convictions/ClaimsAndConvictionsPage";
import { NoClaimDiscountPage } from "./motor/no-claim-discount/NoClaimDiscountPage";
import { AddAdditionalDriverPage } from "./motor/add-additional-driver/AddAdditionalDriverPage";
import { AdditionalDriverPage } from "./motor/additional-driver/AdditionalDriverPage";
import { AdditionalDriverPersonalDetailsPage } from "./motor/additional-driver-personal-details/AdditionalDriverPersonalDetailsPage";
import { AdditionalDriverClaimsPage } from "./motor/additional-driver-claims/AdditionalDriverClaimsPage";
import { CarUsagePage } from "./motor/car-usage/CarUsagePage";
import { PolicyStartDatePage } from "./motor/policy-start-date/PolicyStartDatePage";
import { DeclinePage } from "./motor/decline/DeclinePage";

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

    // ----- Common -----
    get common() {
        return {
            authEntry: this.get("common.authEntry", () => new AuthEntryPage(this.page)),
        };
    }

    // ----- Motor -----
    get motor() {
        return {
            insuranceTypeSelection: this.get(
                "motor.insuranceTypeSelection",
                () => new InsuranceTypeSelectionPage(this.page)
            ),
            carDetails: this.get("motor.carDetails", () => new CarDetailsPage(this.page)),
            drivingLicence: this.get("motor.drivingLicence", () => new DrivingLicencePage(this.page)),
            personalDetails: this.get("motor.personalDetails", () => new PersonalDetailsPage(this.page)),
            claimsAndConvictions: this.get(
                "motor.claimsAndConvictions",
                () => new ClaimsAndConvictionsPage(this.page)
            ),
            noClaimDiscount: this.get(
                "motor.noClaimDiscount",
                () => new NoClaimDiscountPage(this.page)
            ),
            addAdditionalDriver: this.get(
                "motor.addAdditionalDriver",
                () => new AddAdditionalDriverPage(this.page)
            ),
            additionalDriver: this.get(
                "motor.additionalDriver",
                () => new AdditionalDriverPage(this.page)
            ),
            additionalDriverPersonalDetails: this.get(
                "motor.additionalDriverPersonalDetails",
                () => new AdditionalDriverPersonalDetailsPage(this.page)
            ),
            additionalDriverClaims: this.get(
                "motor.additionalDriverClaims",
                () => new AdditionalDriverClaimsPage(this.page)
            ),
            carUsage: this.get("motor.carUsage", () => new CarUsagePage(this.page)),
            policyStartDate: this.get(
                "motor.policyStartDate",
                () => new PolicyStartDatePage(this.page)
            ),
            decline: this.get("motor.decline", () => new DeclinePage(this.page)),
        };
    }
}