// src/businessLayer/pageObjects/objects/athena/common/manage-cookies/aliases.generated.ts
// pageKey: athena.common.manage-cookies
// scannedAt: 2026-04-01T10:40:09.711Z

import type { ElementKey } from "./elements";

export const pageMeta = {
  pageKey: "athena.common.manage-cookies",
  urlPath: "/",
  urlRe: /^\/$/i,
  title: "Allianz login page",
  titleRe: new RegExp("Allianz login page", "i"),
} as const;

export const aliasesGenerated = {
  buttonAcceptAll: "buttonAcceptAll" as ElementKey,
  buttonManageCookies: "buttonManageCookies" as ElementKey,
  buttonRejectAll: "buttonRejectAll" as ElementKey,
  linkReferToOurCookiePolicy: "linkReferToOurCookiePolicy" as ElementKey,
} as const;

export type AliasGeneratedKey = keyof typeof aliasesGenerated;