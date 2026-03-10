// src/pages/motor/car-usage/aliases.ts
// HUMAN-MAINTAINED FILE
// pageKey: motor.car-usage
//
// This file is safe to edit.
// Generator behavior:
// - On first creation, it adds a 1:1 alias for each element (alias == element key).
// - On later runs, it ONLY appends aliases for NEW element keys.
// - It detects "already mapped" by RHS usage: aliasesGenerated.<elementKey>
//   so you can rename the alias key on the left and it won't re-add duplicates.

import type { ElementKey } from "./elements";
import { aliasesGenerated } from "./aliases.generated";

// Business-friendly aliases (edit freely)
// NOTE: AliasKey is derived ONLY from this object, so renaming LHS is fully supported.
export const aliases = {
  "1": aliasesGenerated["1"],
  "2": aliasesGenerated["2"],
  "3": aliasesGenerated["3"],
  "4": aliasesGenerated["4"],
  "5": aliasesGenerated["5"],
  "6": aliasesGenerated["6"],
  addAnotherDriver: aliasesGenerated.addAnotherDriver,
  back: aliasesGenerated.back,
  businessUseCommercial: aliasesGenerated.businessUseCommercial,
  businessUseNonCommercial: aliasesGenerated.businessUseNonCommercial,
  drive: aliasesGenerated.drive,
  garage: aliasesGenerated.garage,
  linkToAllianzHomePage: aliasesGenerated.linkToAllianzHomePage,
  maindriver: aliasesGenerated.maindriver,
  next: aliasesGenerated.next,
  no: aliasesGenerated.no,
  registeredkeeper: aliasesGenerated.registeredkeeper,
  registeredkeeper2: aliasesGenerated.registeredkeeper2,
  road: aliasesGenerated.road,
  securedCarPark: aliasesGenerated.securedCarPark,
  socialDomesticAndPleasure: aliasesGenerated.socialDomesticAndPleasure,
  socialDomesticPleasureAndCommutingSdpC: aliasesGenerated.socialDomesticPleasureAndCommutingSdpC,
  tomAlleneditdelete: aliasesGenerated.tomAlleneditdelete,
  tomAlleneditdelete2: aliasesGenerated.tomAlleneditdelete2,
  tomAlleneditdelete3: aliasesGenerated.tomAlleneditdelete3,
  unsecuredCarPark: aliasesGenerated.unsecuredCarPark,
  vjTomaredit: aliasesGenerated.vjTomaredit,
  vjTomaredit2: aliasesGenerated.vjTomaredit2,
  whatIsThisMiniCooperSh11ukaUsedFor: aliasesGenerated.whatIsThisMiniCooperSh11ukaUsedFor,
  whatSYourEstimatedAnnualMileage: aliasesGenerated.whatSYourEstimatedAnnualMileage,
  whereIsThisCarKeptPleaseEnterPostCodeOnly: aliasesGenerated.whereIsThisCarKeptPleaseEnterPostCodeOnly,
  yes: aliasesGenerated.yes,
} as const satisfies Record<string, ElementKey>;

// Primary type used by Page Objects (business alias keys)
export type AliasKey = keyof typeof aliases;

// Optional: includes generated element keys too (useful for debugging/tools)
export const allAliases = { ...aliasesGenerated, ...aliases } as const;
export type AnyAliasKey = keyof typeof allAliases;