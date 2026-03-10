// src/pages/motor/ph-personal-details/aliases.ts
// HUMAN-MAINTAINED FILE
// pageKey: motor.ph-personal-details
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
  emailAddress: aliasesGenerated.emailAddress,
  lessThan1Year: aliasesGenerated.lessThan1Year,
  linkToAllianzHomePage: aliasesGenerated.linkToAllianzHomePage,
  mobileNumber: aliasesGenerated.mobileNumber,
  next: aliasesGenerated.next,
  no: aliasesGenerated.no,
  no2: aliasesGenerated.no2,
  no3: aliasesGenerated.no3,
  pleaseChooseTheTypeOfYourEducation: aliasesGenerated.pleaseChooseTheTypeOfYourEducation,
  reactSelect10Input: aliasesGenerated.reactSelect10Input,
  reactSelect5Input: aliasesGenerated.reactSelect5Input,
  reactSelect6Input: aliasesGenerated.reactSelect6Input,
  reactSelect7Input: aliasesGenerated.reactSelect7Input,
  reactSelect8Input: aliasesGenerated.reactSelect8Input,
  reactSelect9Input: aliasesGenerated.reactSelect9Input,
  whatSYourEmploymentStatus: aliasesGenerated.whatSYourEmploymentStatus,
  whatSYourMaritalStatus: aliasesGenerated.whatSYourMaritalStatus,
  yes: aliasesGenerated.yes,
  yes2: aliasesGenerated.yes2,
  yes3: aliasesGenerated.yes3,
} as const satisfies Record<string, ElementKey>;

// Primary type used by Page Objects (business alias keys)
export type AliasKey = keyof typeof aliases;

// Optional: includes generated element keys too (useful for debugging/tools)
export const allAliases = { ...aliasesGenerated, ...aliases } as const;
export type AnyAliasKey = keyof typeof allAliases;