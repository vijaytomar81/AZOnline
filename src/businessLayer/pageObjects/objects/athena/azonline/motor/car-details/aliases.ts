// src/businessLayer/pageObjects/objects/athena/azonline/motor/car-details/aliases.ts
// pageKey: athena.azonline.motor.car-details
//
// This file is safe to edit.
//
// Generator behavior:
// - On first creation, it adds a 1:1 alias for each element.
// - On later runs, it only appends aliases for new element keys.
// - Existing aliases are never rewritten or removed.
// - The generator detects existing mappings by scanning RHS aliasesGenerated references.

import type { ElementKey } from "./elements";
import { aliasesGenerated } from "./aliases.generated";

// Business-friendly aliases (edit freely)
export const aliases = {
  buttonFindMyCar: aliasesGenerated.buttonFindMyCar,
  groupRadioRegistrationNumberPolarQuestion: aliasesGenerated.groupRadioRegistrationNumberPolarQuestion,
  inputRegistrationNumber: aliasesGenerated.inputRegistrationNumber,
  linkPersonalInfoUse: aliasesGenerated.linkPersonalInfoUse,
  linkToAllianzHomePage: aliasesGenerated.linkToAllianzHomePage,
  radioRegistrationNumberPolarQuestionNo: aliasesGenerated.radioRegistrationNumberPolarQuestionNo,
  radioRegistrationNumberPolarQuestionYes: aliasesGenerated.radioRegistrationNumberPolarQuestionYes,
} as const satisfies Record<string, ElementKey>;

export const aliasKeys = {
  buttonFindMyCar: "buttonFindMyCar",
  groupRadioRegistrationNumberPolarQuestion: "groupRadioRegistrationNumberPolarQuestion",
  inputRegistrationNumber: "inputRegistrationNumber",
  linkPersonalInfoUse: "linkPersonalInfoUse",
  linkToAllianzHomePage: "linkToAllianzHomePage",
  radioRegistrationNumberPolarQuestionNo: "radioRegistrationNumberPolarQuestionNo",
  radioRegistrationNumberPolarQuestionYes: "radioRegistrationNumberPolarQuestionYes",
} as const satisfies Record<keyof typeof aliases, keyof typeof aliases>;

export type AliasKey = keyof typeof aliases;

export const allAliases = { ...aliasesGenerated, ...aliases } as const;
export type AnyAliasKey = keyof typeof allAliases;