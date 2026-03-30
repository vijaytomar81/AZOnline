// src/pageObjects/objects/athena/common/login-or-registration/aliases.generated.ts
// REPAIRED FILE
// pageKey: athena.common.login-or-registration

import type { ElementKey } from "./elements";

export const pageMeta = {
  pageKey: "athena.common.login-or-registration",
  urlPath: "/",
  urlRe: /^\/$/i,
  title: "Allianz login page",
  titleRe: new RegExp("Allianz login page", "i"),
} as const;

export const aliasesGenerated = {
  linkToAllianzHomePage: "linkToAllianzHomePage" as ElementKey,
  logIn: "logIn" as ElementKey,
  register: "register" as ElementKey,
  skipThisStepILlRegisterLater: "skipThisStepILlRegisterLater" as ElementKey,
} as const;

export type AliasGeneratedKey = keyof typeof aliasesGenerated;
