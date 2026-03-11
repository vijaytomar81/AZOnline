// src/pages/motor/ad-claims-and-convictions/aliases.ts
// HUMAN-MAINTAINED FILE
// pageKey: motor.ad-claims-and-convictions
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
  "1": aliasesGenerated["1"],
  "2": aliasesGenerated["2"],
  "3": aliasesGenerated["3"],
  "4": aliasesGenerated["4"],
  back: aliasesGenerated.back,
  linkToAllianzHomePage: aliasesGenerated.linkToAllianzHomePage,
  month: aliasesGenerated.month,
  month2: aliasesGenerated.month2,
  month3: aliasesGenerated.month3,
  month4: aliasesGenerated.month4,
  next: aliasesGenerated.next,
  no: aliasesGenerated.no,
  removeClaim: aliasesGenerated.removeClaim,
  removeClaim2: aliasesGenerated.removeClaim2,
  removeClaim3: aliasesGenerated.removeClaim3,
  removeClaim4: aliasesGenerated.removeClaim4,
  whatHappened: aliasesGenerated.whatHappened,
  whatHappened2: aliasesGenerated.whatHappened2,
  whatHappened3: aliasesGenerated.whatHappened3,
  whatHappened4: aliasesGenerated.whatHappened4,
  year: aliasesGenerated.year,
  year2: aliasesGenerated.year2,
  year3: aliasesGenerated.year3,
  year4: aliasesGenerated.year4,
  yes: aliasesGenerated.yes,
} as const satisfies Record<string, ElementKey>;

// Primary type used by Page Objects (business alias keys)
export type AliasKey = keyof typeof aliases;

// Optional: includes generated element keys too (useful for debugging/tools)
export const allAliases = { ...aliasesGenerated, ...aliases } as const;
export type AnyAliasKey = keyof typeof allAliases;