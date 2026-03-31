// src/pageObjects/objects/athena/common/insurance-type-selection/aliases.ts
// pageKey: athena.common.insurance-type-selection
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
  buttonInputBack: aliasesGenerated.buttonInputBack,
  linkCarQuote: aliasesGenerated.linkCarQuote,
  linkHomeQuote: aliasesGenerated.linkHomeQuote,
  linkInputBack: aliasesGenerated.linkInputBack,
  linkLetUsKnow: aliasesGenerated.linkLetUsKnow,
  linkTermsAndConditionsApply: aliasesGenerated.linkTermsAndConditionsApply,
  linkToAllianzHomePage: aliasesGenerated.linkToAllianzHomePage,
} as const satisfies Record<string, ElementKey>;

// Primary type used by Page Objects (business alias keys)
export type AliasKey = keyof typeof aliases;

// Optional: includes generated element keys too (useful for debugging/tools)
export const allAliases = { ...aliasesGenerated, ...aliases } as const;
export type AnyAliasKey = keyof typeof allAliases;