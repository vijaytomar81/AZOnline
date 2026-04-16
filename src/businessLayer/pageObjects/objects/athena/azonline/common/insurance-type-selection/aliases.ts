// src/businessLayer/pageObjects/objects/athena/azonline/common/insurance-type-selection/aliases.ts
// pageKey: athena.azonline.common.insurance-type-selection
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
  buttonInputBack: aliasesGenerated.buttonInputBack,
  linkCarQuote: aliasesGenerated.linkCarQuote,
  linkHomeQuote: aliasesGenerated.linkHomeQuote,
  linkInputBack: aliasesGenerated.linkInputBack,
  linkLetUsKnow: aliasesGenerated.linkLetUsKnow,
  linkTermsAndConditionsApply: aliasesGenerated.linkTermsAndConditionsApply,
  linkToAllianzHomePage: aliasesGenerated.linkToAllianzHomePage,
} as const satisfies Record<string, ElementKey>;

export const aliasKeys = {
  buttonInputBack: "buttonInputBack",
  linkCarQuote: "linkCarQuote",
  linkHomeQuote: "linkHomeQuote",
  linkInputBack: "linkInputBack",
  linkLetUsKnow: "linkLetUsKnow",
  linkTermsAndConditionsApply: "linkTermsAndConditionsApply",
  linkToAllianzHomePage: "linkToAllianzHomePage",
} as const satisfies Record<keyof typeof aliases, keyof typeof aliases>;

export type AliasKey = keyof typeof aliases;

export const allAliases = { ...aliasesGenerated, ...aliases } as const;
export type AnyAliasKey = keyof typeof allAliases;