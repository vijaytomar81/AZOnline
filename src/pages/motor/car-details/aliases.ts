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
  back: aliasesGenerated.back,
  findMyCar: aliasesGenerated.findMyCar,
  hasmodificationFalseNo: aliasesGenerated.hasmodificationFalseNo,
  hasmodificationTrueYes: aliasesGenerated.hasmodificationTrueYes,
  linkToAllianzHomePage: aliasesGenerated.linkToAllianzHomePage,
  next: aliasesGenerated.next,
  purchaseMonthInputField: aliasesGenerated.purchaseMonthInputField,
  purchaseYearInputField: aliasesGenerated.purchaseYearInputField,
  registrationnumberpolarquestionNo: aliasesGenerated.registrationnumberpolarquestionNo,
  registrationnumberpolarquestionYes: aliasesGenerated.registrationnumberpolarquestionYes,
  startTypingTheMakeOfYourVehicle: aliasesGenerated.startTypingTheMakeOfYourVehicle,
  startTypingTheModelNameOfYourVehicle: aliasesGenerated.startTypingTheModelNameOfYourVehicle,
  startTypingTheModelNameOfYourVehicle2: aliasesGenerated.startTypingTheModelNameOfYourVehicle2,
  theCarHasnTBeenBoughtYet: aliasesGenerated.theCarHasnTBeenBoughtYet,
  uploadAPhotoOfYourCarSNumberPlate: aliasesGenerated.uploadAPhotoOfYourCarSNumberPlate,
  vehicledetailssetcorrectlyNo: aliasesGenerated.vehicledetailssetcorrectlyNo,
  vehicledetailssetcorrectlyYes: aliasesGenerated.vehicledetailssetcorrectlyYes,
  vehicleDoors: aliasesGenerated.vehicleDoors,
  vehiclefueltypedDiesel: aliasesGenerated.vehiclefueltypedDiesel,
  vehiclefueltypepPetrol: aliasesGenerated.vehiclefueltypepPetrol,
  vehicleManufactureYear: aliasesGenerated.vehicleManufactureYear,
  vehicletransmissionaAutomatic: aliasesGenerated.vehicletransmissionaAutomatic,
  vehicletransmissionmManual: aliasesGenerated.vehicletransmissionmManual,
  viewHowWeLlUseYourInfo: aliasesGenerated.viewHowWeLlUseYourInfo,
  whatSYourCarRegistrationNumber: aliasesGenerated.whatSYourCarRegistrationNumber,
} as const satisfies Record<string, ElementKey>;

// Primary type used by Page Objects (business alias keys)
export type AliasKey = keyof typeof aliases;

// Optional: includes generated element keys too (useful for debugging/tools)
export const allAliases = { ...aliasesGenerated, ...aliases } as const;
export type AnyAliasKey = keyof typeof allAliases;