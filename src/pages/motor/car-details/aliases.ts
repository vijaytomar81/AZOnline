// HUMAN-MAINTAINED FILE
// pageKey: motor.car-details
//
// Put business-friendly aliases here.
// Rules:
// - ONLY add business names you will use in Page actions / flows.
// - Point each business alias to aliasesGenerated.<elementKey> (so types stay correct).
// - Do NOT rename keys in aliases.generated.ts (auto file).

import type { ElementKey } from "./elements";
import { aliasesGenerated } from "./aliases.generated";

/**
 * Business aliases (stable names you use in Page actions / flows).
 * These override/augment machine aliases.
 */
export const aliases: Record<string, ElementKey> = {
  // --- navigation ---
  next: aliasesGenerated.next,
  back: aliasesGenerated.back,

  // --- Step-1: "Do you know your registration?" ---
  knowRegYes: aliasesGenerated.yes,
  knowRegNo: aliasesGenerated.no,

  // --- Step-2: registration input + CTA ---
  registrationNumber: aliasesGenerated.whatSYourCarRegistrationNumber,
  findMyCar: aliasesGenerated.findMyCar,

  // --- purchase date ---
  purchaseMonth: aliasesGenerated.purchaseMonthInputField,
  purchaseYear: aliasesGenerated.purchaseYearInputField,

  // --- transmission ---
  transmissionManual: aliasesGenerated.manual,
  transmissionAutomatic: aliasesGenerated.automatic,

  // --- fuel type ---
  fuelPetrol: aliasesGenerated.petrol,
  fuelDiesel: aliasesGenerated.diesel,

  // --- make / model ---
  vehicleMake: aliasesGenerated.startTypingTheMakeOfYourVehicle,

  /**
   * Choose ONE as your "primary" model field.
   * In your current page code you can try vehicleModel first and optionally fall back to vehicleModelAlt.
   */
  vehicleModel: aliasesGenerated.startTypingTheModelNameOfYourVehicle2,
  vehicleModelAlt: aliasesGenerated.startTypingTheModelNameOfYourVehicle,

  // --- selects ---
  manufactureYear: aliasesGenerated.vehicleManufactureYear,
  doors: aliasesGenerated.vehicleDoors,

  // --- checkbox ---
  notBoughtYet: aliasesGenerated.theCarHasnTBeenBoughtYet,

  // --- cookie banner (optional; usually handled by CookieBanner class) ---
  cookieAcceptAll: aliasesGenerated.acceptAll,
  cookieRejectAll: aliasesGenerated.rejectAll,
  cookieManage: aliasesGenerated.manageCookiesOpensThePreferenceCenterDialog,
};

export const allAliases = { ...aliasesGenerated, ...aliases } as const;
export type AliasKey = keyof typeof allAliases;