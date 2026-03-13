// src/pages/athena/motor/ph-driving-licence-details/aliases.ts
// HUMAN-MAINTAINED FILE
// pageKey: athena.motor.ph-driving-licence-details
//
// This file is safe to edit.
//
// Generator behavior:
//
// - On first creation, it adds a 1:1 alias for each element
//   (alias key == element key).
//
// - On later runs, it ONLY appends aliases for NEW element keys.
//   Existing aliases are never rewritten or removed.
//
// - The generator detects whether an element is already mapped
//   by scanning RHS usage of aliasesGenerated references.
//
//   Supported formats:
//     aliasesGenerated.elementKey
//     aliasesGenerated["elementKey"]
//
//   Bracket notation is required for keys that are NOT valid
//   TypeScript identifiers (for example numeric keys like "1", "2", etc.).
//
// - Because detection relies on the RHS (aliasesGenerated.*), you are
//   free to rename the alias key on the left-hand side (business alias)
//   without the generator re-adding duplicates.
//
//   Example:
//     driverClaims: aliasesGenerated.additionalDriver1NumberOfClaims
//
//   The generator will recognize the RHS and will NOT re-add
//   additionalDriver1NumberOfClaims again.

import type { ElementKey } from "./elements";
import { aliasesGenerated } from "./aliases.generated";

// Business-friendly aliases (edit freely)
// NOTE: AliasKey is derived ONLY from this object, so renaming LHS is fully supported.
export const aliases = {
  buttonAddAnotherConviction: aliasesGenerated.buttonAddAnotherConviction,
  buttonFindAddress: aliasesGenerated.buttonFindAddress,
  buttonNavigatorBack: aliasesGenerated.buttonNavigatorBack,
  buttonNavigatorNext: aliasesGenerated.buttonNavigatorNext,
  groupRadioConviction0ResultedToABan: aliasesGenerated.groupRadioConviction0ResultedToABan,
  groupRadioConviction1ResultedToABan: aliasesGenerated.groupRadioConviction1ResultedToABan,
  groupRadioConviction2ResultedToABan: aliasesGenerated.groupRadioConviction2ResultedToABan,
  groupRadioDrivingLicenceHandy: aliasesGenerated.groupRadioDrivingLicenceHandy,
  groupRadioDrivingLicenceTypes: aliasesGenerated.groupRadioDrivingLicenceTypes,
  groupRadioHasConvictionsQuestion: aliasesGenerated.groupRadioHasConvictionsQuestion,
  inputAddressLookupWidgetAddressLookupQuestionInputBuilding: aliasesGenerated.inputAddressLookupWidgetAddressLookupQuestionInputBuilding,
  inputAddressLookupWidgetAddressLookupQuestionInputPostcode: aliasesGenerated.inputAddressLookupWidgetAddressLookupQuestionInputPostcode,
  inputConviction1DateMonth: aliasesGenerated.inputConviction1DateMonth,
  inputConviction1DateYear: aliasesGenerated.inputConviction1DateYear,
  inputConviction2DateMonth: aliasesGenerated.inputConviction2DateMonth,
  inputConviction2DateYear: aliasesGenerated.inputConviction2DateYear,
  inputConviction3DateMonth: aliasesGenerated.inputConviction3DateMonth,
  inputConviction3DateYear: aliasesGenerated.inputConviction3DateYear,
  inputDateOfBirthDay: aliasesGenerated.inputDateOfBirthDay,
  inputDateOfBirthMonth: aliasesGenerated.inputDateOfBirthMonth,
  inputDateOfBirthYear: aliasesGenerated.inputDateOfBirthYear,
  inputFirstName: aliasesGenerated.inputFirstName,
  inputLastName: aliasesGenerated.inputLastName,
  linkRemoveConviction: aliasesGenerated.linkRemoveConviction,
  linkRemoveConviction2: aliasesGenerated.linkRemoveConviction2,
  linkRemoveConviction3: aliasesGenerated.linkRemoveConviction3,
  linkToAllianzHomePage: aliasesGenerated.linkToAllianzHomePage,
  radioConviction0ResultedToABanno: aliasesGenerated.radioConviction0ResultedToABanno,
  radioConviction0ResultedToABanyes: aliasesGenerated.radioConviction0ResultedToABanyes,
  radioConviction1ResultedToABanno: aliasesGenerated.radioConviction1ResultedToABanno,
  radioConviction1ResultedToABanyes: aliasesGenerated.radioConviction1ResultedToABanyes,
  radioConviction2ResultedToABanno: aliasesGenerated.radioConviction2ResultedToABanno,
  radioConviction2ResultedToABanyes: aliasesGenerated.radioConviction2ResultedToABanyes,
  radioDrivingLicenceHandyno: aliasesGenerated.radioDrivingLicenceHandyno,
  radioDrivingLicenceHandyyes: aliasesGenerated.radioDrivingLicenceHandyyes,
  radioDrivingLicenceTypeseuFull: aliasesGenerated.radioDrivingLicenceTypeseuFull,
  radioDrivingLicenceTypeseuProvisional: aliasesGenerated.radioDrivingLicenceTypeseuProvisional,
  radioDrivingLicenceTypesother: aliasesGenerated.radioDrivingLicenceTypesother,
  radioDrivingLicenceTypesukFull: aliasesGenerated.radioDrivingLicenceTypesukFull,
  radioDrivingLicenceTypesukFullAutomaticOnly: aliasesGenerated.radioDrivingLicenceTypesukFullAutomaticOnly,
  radioDrivingLicenceTypesukProvisional: aliasesGenerated.radioDrivingLicenceTypesukProvisional,
  radioHasConvictionsQuestionno: aliasesGenerated.radioHasConvictionsQuestionno,
  radioHasConvictionsQuestionyes: aliasesGenerated.radioHasConvictionsQuestionyes,
  searchSelectTheConvictionCode: aliasesGenerated.searchSelectTheConvictionCode,
  searchSelectTheConvictionCode2: aliasesGenerated.searchSelectTheConvictionCode2,
  searchSelectTheConvictionCode3: aliasesGenerated.searchSelectTheConvictionCode3,
  selectAddressLookupQuestionInput: aliasesGenerated.selectAddressLookupQuestionInput,
  selectDrivingExpirience: aliasesGenerated.selectDrivingExpirience,
  selectTitleQuestion: aliasesGenerated.selectTitleQuestion,
} as const satisfies Record<string, ElementKey>;

// Primary type used by Page Objects (business alias keys)
export type AliasKey = keyof typeof aliases;

// Optional: includes generated element keys too (useful for debugging/tools)
export const allAliases = { ...aliasesGenerated, ...aliases } as const;
export type AnyAliasKey = keyof typeof allAliases;