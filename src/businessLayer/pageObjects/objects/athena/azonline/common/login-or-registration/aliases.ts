// src/businessLayer/pageObjects/objects/athena/azonline/common/login-or-registration/aliases.ts
// pageKey: athena.azonline.common.login-or-registration
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
  linkToAllianzHomePage: aliasesGenerated.linkToAllianzHomePage,
  logIn: aliasesGenerated.logIn,
  register: aliasesGenerated.register,
  skipThisStepILlRegisterLater: aliasesGenerated.skipThisStepILlRegisterLater,
} as const satisfies Record<string, ElementKey>;

export const aliasKeys = {
  linkToAllianzHomePage: "linkToAllianzHomePage",
  logIn: "logIn",
  register: "register",
  skipThisStepILlRegisterLater: "skipThisStepILlRegisterLater",
} as const satisfies Record<keyof typeof aliases, keyof typeof aliases>;

export type AliasKey = keyof typeof aliases;

export const allAliases = { ...aliasesGenerated, ...aliases } as const;
export type AnyAliasKey = keyof typeof allAliases;