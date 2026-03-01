// HUMAN-MAINTAINED FILE
// pageKey: motor.car-details
//
// Business-friendly aliases (Enterprise Layer).
// NEVER edit aliases.generated.ts.
// This file is safe from regeneration.

import type { ElementKey } from "./elements";
import { aliasesGenerated } from "./aliases.generated";

/**
 * BUSINESS ALIASES
 *
 * Goal:
 * - Hide scanner-generated naming
 * - Expose stable business language
 * - Keep tests readable
 */

export const aliases = {
  // --------------------------------------------------
  // FLOW 1 — REGISTRATION KNOWN
  // --------------------------------------------------
  knowRegYes: aliasesGenerated.registrationnumberpolarquestionYes,
  knowRegNo: aliasesGenerated.registrationnumberpolarquestionNo,

  regInput: aliasesGenerated.whatSYourCarRegistrationNumber,
  findMyCar: aliasesGenerated.findMyCar,

  // --------------------------------------------------
  // FLOW 2 — MANUAL ENTRY
  // --------------------------------------------------
  manualMake: aliasesGenerated.startTypingTheMakeOfYourVehicle,
  manualModelShort: aliasesGenerated.startTypingTheModelNameOfYourVehicle,
  manualModel: aliasesGenerated.startTypingTheModelNameOfYourVehicle2,

  manufactureYear: aliasesGenerated.vehicleManufactureYear,

  purchaseMonth: aliasesGenerated.purchaseMonthInputField,
  purchaseYear: aliasesGenerated.purchaseYearInputField,

  carNotBoughtYet: aliasesGenerated.theCarHasnTBeenBoughtYet,

  transmissionManual: aliasesGenerated.vehicletransmissionmManual,
  transmissionAutomatic: aliasesGenerated.vehicletransmissionaAutomatic,

  fuelPetrol: aliasesGenerated.vehiclefueltypepPetrol,
  fuelDiesel: aliasesGenerated.vehiclefueltypedDiesel,

  vehicleDoors: aliasesGenerated.vehicleDoors,

  // --------------------------------------------------
  // COMMON ACTIONS
  // --------------------------------------------------
  next: aliasesGenerated.next,
  back: aliasesGenerated.back,
  done: aliasesGenerated.allDone,
  
  confirmVehicleYes: aliasesGenerated.vehicledetailssetcorrectlyYes,
  confirmVehicleNo: aliasesGenerated.vehicledetailssetcorrectlyNo,

  carModifiedYes: aliasesGenerated.hasmodificationTrueYes,
  carModifiedNo: aliasesGenerated.hasmodificationFalseNo,

  // --------------------------------------------------
  // OPTIONAL / UTILITY
  // --------------------------------------------------
  uploadVrnPhoto: aliasesGenerated.uploadAPhotoOfYourCarSNumberPlate,
  privacyInfo: aliasesGenerated.viewHowWeLlUseYourInfo,
  homeLink: aliasesGenerated.linkToAllianzHomePage,
} as Record<string, ElementKey>;

/**
 * Final alias set
 * (generated + human overrides)
 */
export const allAliases = { ...aliasesGenerated, ...aliases } as const;

export type AliasKey = keyof typeof allAliases;