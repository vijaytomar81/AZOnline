// src/pages/pageManager.ts
import type { Page } from "@playwright/test";
import { AdClaimsAndConvictionsPage } from "./motor/ad-claims-and-convictions/AdClaimsAndConvictionsPage";
import { AdDrivingLicenceDetailsPage } from "./motor/ad-driving-licence-details/AdDrivingLicenceDetailsPage";
import { AdPersonalDetailsPage } from "./motor/ad-personal-details/AdPersonalDetailsPage";
import { CarDetailsPage } from "./motor/car-details/CarDetailsPage";
import { CarUsagePage } from "./motor/car-usage/CarUsagePage";
import { CoverStartDatePage } from "./motor/cover-start-date/CoverStartDatePage";
import { InsuranceTypeSelectionPage } from "./common/insurance-type-selection/InsuranceTypeSelectionPage";
import { LoginOrRegistrationPage } from "./common/login-or-registration/LoginOrRegistrationPage";
import { PhAddDriverPage } from "./motor/ph-add-driver/PhAddDriverPage";
import { PhClaimsAndConvictionsPage } from "./motor/ph-claims-and-convictions/PhClaimsAndConvictionsPage";
import { PhDrivingLicenceDetailsPage } from "./motor/ph-driving-licence-details/PhDrivingLicenceDetailsPage";
import { PhNoClaimDiscountPage } from "./motor/ph-no-claim-discount/PhNoClaimDiscountPage";
import { PhPersonalDetailsPage } from "./motor/ph-personal-details/PhPersonalDetailsPage";


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

    

    get common() {
        return {
            insuranceTypeSelection: this.get("common.insuranceTypeSelection", () => new InsuranceTypeSelectionPage(this.page)),
            loginOrRegistration: this.get("common.loginOrRegistration", () => new LoginOrRegistrationPage(this.page)),
        };
    }

    get motor() {
        return {
            adClaimsAndConvictions: this.get("motor.adClaimsAndConvictions", () => new AdClaimsAndConvictionsPage(this.page)),
            adDrivingLicenceDetails: this.get("motor.adDrivingLicenceDetails", () => new AdDrivingLicenceDetailsPage(this.page)),
            adPersonalDetails: this.get("motor.adPersonalDetails", () => new AdPersonalDetailsPage(this.page)),
            carDetails: this.get("motor.carDetails", () => new CarDetailsPage(this.page)),
            carUsage: this.get("motor.carUsage", () => new CarUsagePage(this.page)),
            coverStartDate: this.get("motor.coverStartDate", () => new CoverStartDatePage(this.page)),
            phAddDriver: this.get("motor.phAddDriver", () => new PhAddDriverPage(this.page)),
            phClaimsAndConvictions: this.get("motor.phClaimsAndConvictions", () => new PhClaimsAndConvictionsPage(this.page)),
            phDrivingLicenceDetails: this.get("motor.phDrivingLicenceDetails", () => new PhDrivingLicenceDetailsPage(this.page)),
            phNoClaimDiscount: this.get("motor.phNoClaimDiscount", () => new PhNoClaimDiscountPage(this.page)),
            phPersonalDetails: this.get("motor.phPersonalDetails", () => new PhPersonalDetailsPage(this.page)),
        };
    }

}
