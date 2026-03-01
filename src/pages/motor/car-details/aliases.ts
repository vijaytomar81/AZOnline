// HUMAN-MAINTAINED FILE
// pageKey: motor.car-details
//
// Put business-friendly aliases here. Example:
// export const aliases = {
//   continue: "next",
//   vrn: "whatSYourCarRegistrationNumber",
// } as const;

import type { ElementKey } from "./elements";
import { aliasesGenerated } from "./aliases.generated";

// Start empty. You can map business names -> ElementKey.
export const aliases = {
  // example: continue: aliasesGenerated.next,
} as Record<string, ElementKey>;

export const allAliases = { ...aliasesGenerated, ...aliases } as const;
export type AliasKey = keyof typeof allAliases;
