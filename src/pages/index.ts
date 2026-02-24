// src/pages/index.ts
export { PageManager } from "./pageManager";

// Export individual pages too (optional, but useful sometimes)
export { AuthEntryPage } from "./common/AuthEntryPage";

export { InsuranceTypeSelectionPage } from "./motor/insurance-type-selection/InsuranceTypeSelectionPage";
export { CarDetailsPage } from "./motor/car-details/CarDetailsPage";
export { DrivingLicencePage } from "./motor/driving-licence/DrivingLicencePage";
export { PersonalDetailsPage } from "./motor/personal-details/PersonalDetailsPage";
export { ClaimsAndConvictionsPage } from "./motor/claims-and-convictions/ClaimsAndConvictionsPage";
export { NoClaimDiscountPage } from "./motor/no-claim-discount/NoClaimDiscountPage";
export { AddAdditionalDriverPage } from "./motor/add-additional-driver/AddAdditionalDriverPage";
export { AdditionalDriverPage } from "./motor/additional-driver/AdditionalDriverPage";
export { AdditionalDriverPersonalDetailsPage } from "./motor/additional-driver-personal-details/AdditionalDriverPersonalDetailsPage";
export { AdditionalDriverClaimsPage } from "./motor/additional-driver-claims/AdditionalDriverClaimsPage";
export { CarUsagePage } from "./motor/car-usage/CarUsagePage";
export { PolicyStartDatePage } from "./motor/policy-start-date/PolicyStartDatePage";
export { DeclinePage } from "./motor/decline/DeclinePage";