// src/pages/motor/car-details/aliases.ts
// HUMAN-MAINTAINED FILE
// pageKey: motor.car-details
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
  allDone: aliasesGenerated.allDone,
  automatic: aliasesGenerated.automatic,
  back: aliasesGenerated.back,
  diesel: aliasesGenerated.diesel,
  findMyCar: aliasesGenerated.findMyCar,
  linkToAllianzHomePage: aliasesGenerated.linkToAllianzHomePage,
  manual: aliasesGenerated.manual,
  next: aliasesGenerated.next,
  no: aliasesGenerated.no,
  no2: aliasesGenerated.no2,
  petrol: aliasesGenerated.petrol,
  purchaseMonthInputField: aliasesGenerated.purchaseMonthInputField,
  purchaseYearInputField: aliasesGenerated.purchaseYearInputField,
  startTypingTheMakeOfYourVehicle: aliasesGenerated.startTypingTheMakeOfYourVehicle,
  startTypingTheModelNameOfYourVehicle: aliasesGenerated.startTypingTheModelNameOfYourVehicle,
  startTypingTheModelNameOfYourVehicle2: aliasesGenerated.startTypingTheModelNameOfYourVehicle2,
  theCarHasnTBeenBoughtYet: aliasesGenerated.theCarHasnTBeenBoughtYet,
  uploadAPhotoOfYourCarSNumberPlate: aliasesGenerated.uploadAPhotoOfYourCarSNumberPlate,
  vehicleDoors: aliasesGenerated.vehicleDoors,
  vehicleManufactureYear: aliasesGenerated.vehicleManufactureYear,
  viewHowWeLlUseYourInfo: aliasesGenerated.viewHowWeLlUseYourInfo,
  whatSYourCarRegistrationNumber: aliasesGenerated.whatSYourCarRegistrationNumber,
  yes: aliasesGenerated.yes,
  yes2: aliasesGenerated.yes2,
} as const satisfies Record<string, ElementKey>;

// Primary type used by Page Objects (business alias keys)
export type AliasKey = keyof typeof aliases;

// Optional: includes generated element keys too (useful for debugging/tools)
export const allAliases = { ...aliasesGenerated, ...aliases } as const;
export type AnyAliasKey = keyof typeof allAliases;