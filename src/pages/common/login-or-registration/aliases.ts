// src/pages/common/login-or-registration/aliases.ts
// HUMAN-MAINTAINED FILE
// pageKey: common.login-or-registration
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
  linkToAllianzHomePage: aliasesGenerated.linkToAllianzHomePage,
  logIn: aliasesGenerated.logIn,
  register: aliasesGenerated.register,
  skipThisStepILlRegisterLater: aliasesGenerated.skipThisStepILlRegisterLater,
} as const satisfies Record<string, ElementKey>;

// Primary type used by Page Objects (business alias keys)
export type AliasKey = keyof typeof aliases;

// Optional: includes generated element keys too (useful for debugging/tools)
export const allAliases = { ...aliasesGenerated, ...aliases } as const;
export type AnyAliasKey = keyof typeof allAliases;