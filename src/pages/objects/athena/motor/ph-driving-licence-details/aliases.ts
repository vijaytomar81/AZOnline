// src/pages/objects/athena/motor/ph-driving-licence-details/aliases.ts
// REPAIRED FILE
// pageKey: athena.motor.ph-driving-licence-details

import type { ElementKey } from "./elements";
import { aliasesGenerated } from "./aliases.generated";

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

export type AliasKey = keyof typeof aliases;
export const allAliases = { ...aliasesGenerated, ...aliases } as const;
export type AnyAliasKey = keyof typeof allAliases;
