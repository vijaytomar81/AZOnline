// src/businessLayer/pageObjects/objects/athena/azonline/motor/car-details/aliases.generated.ts
// pageKey: athena.azonline.motor.car-details
// scannedAt: 2026-04-16T19:49:15.528Z

import type { ElementKey } from "./elements";

export const pageMeta = {
  pageKey: "athena.azonline.motor.car-details",
  urlPath: "/journey/show/product/AnnualMotorInsurance/process/nb/numberPlateScan/69e13d24db62f63f1acab464",
  urlRe: /\/journey\/show\/product\/AnnualMotorInsurance\/process\/nb\/numberPlateScan\/[a-z0-9]+/i,
  title: "Car details",
  titleRe: new RegExp("Car details", "i"),
} as const;

export const aliasesGenerated = {
  buttonFindMyCar: "buttonFindMyCar" as ElementKey,
  groupRadioRegistrationNumberPolarQuestion: "groupRadioRegistrationNumberPolarQuestion" as ElementKey,
  inputRegistrationNumber: "inputRegistrationNumber" as ElementKey,
  linkPersonalInfoUse: "linkPersonalInfoUse" as ElementKey,
  linkToAllianzHomePage: "linkToAllianzHomePage" as ElementKey,
  radioRegistrationNumberPolarQuestionNo: "radioRegistrationNumberPolarQuestionNo" as ElementKey,
  radioRegistrationNumberPolarQuestionYes: "radioRegistrationNumberPolarQuestionYes" as ElementKey,
} as const;

export type AliasGeneratedKey = keyof typeof aliasesGenerated;