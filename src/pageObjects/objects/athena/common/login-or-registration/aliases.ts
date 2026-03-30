// src/pageObjects/objects/athena/common/login-or-registration/aliases.ts
// REPAIRED FILE
// pageKey: athena.common.login-or-registration

import type { ElementKey } from "./elements";
import { aliasesGenerated } from "./aliases.generated";

export const aliases = {
  logIn: aliasesGenerated.logIn,
  register: aliasesGenerated.register,
  skipThisStepILlRegisterLater: aliasesGenerated.skipThisStepILlRegisterLater,
  linkToAllianzHomePage: aliasesGenerated.linkToAllianzHomePage,
} as const satisfies Record<string, ElementKey>;

export type AliasKey = keyof typeof aliases;
export const allAliases = { ...aliasesGenerated, ...aliases } as const;
export type AnyAliasKey = keyof typeof allAliases;
