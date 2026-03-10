// src/pages/motor/ad-personal-details/aliases.ts
// HUMAN-MAINTAINED FILE
// pageKey: motor.ad-personal-details
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
  "12Years": aliasesGenerated["12Years"],
  "23Years": aliasesGenerated["23Years"],
  back: aliasesGenerated.back,
  closeAlert: aliasesGenerated.closeAlert,
  lessThan1Year: aliasesGenerated.lessThan1Year,
  linkToAllianzHomePage: aliasesGenerated.linkToAllianzHomePage,
  next: aliasesGenerated.next,
  no: aliasesGenerated.no,
  no2: aliasesGenerated.no2,
  pleaseChooseTheTypeOfDriverSEducation: aliasesGenerated.pleaseChooseTheTypeOfDriverSEducation,
  reactSelect16Input: aliasesGenerated.reactSelect16Input,
  reactSelect17Input: aliasesGenerated.reactSelect17Input,
  reactSelect18Input: aliasesGenerated.reactSelect18Input,
  reactSelect19Input: aliasesGenerated.reactSelect19Input,
  reactSelect20Input: aliasesGenerated.reactSelect20Input,
  reactSelect21Input: aliasesGenerated.reactSelect21Input,
  whatSDriverSEmploymentStatus: aliasesGenerated.whatSDriverSEmploymentStatus,
  whatSDriverSMaritalStatus: aliasesGenerated.whatSDriverSMaritalStatus,
  whatSDriverSRelationshipToAccountHolder: aliasesGenerated.whatSDriverSRelationshipToAccountHolder,
  yes: aliasesGenerated.yes,
  yes2: aliasesGenerated.yes2,
} as const satisfies Record<string, ElementKey>;

// Primary type used by Page Objects (business alias keys)
export type AliasKey = keyof typeof aliases;

// Optional: includes generated element keys too (useful for debugging/tools)
export const allAliases = { ...aliasesGenerated, ...aliases } as const;
export type AnyAliasKey = keyof typeof allAliases;