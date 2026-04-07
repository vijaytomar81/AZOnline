// src/pageObjects/objects/athena/common/login-or-registration/aliases.ts
// pageKey: athena.common.login-or-registration
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