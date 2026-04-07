// src/pageObjects/objects/athena/common/manage-cookies/elements.ts
// pageKey: athena.common.manage-cookies
// scannedAt: 2026-04-01T10:40:09.711Z

export type ElementDef = {
  type: string;
  preferred: string;
  fallbacks: readonly string[];
  stableKey?: string;
};

export const elements = {
  linkReferToOurCookiePolicy: {
    type: "link",
    preferred: "css=a[aria-label=\"More information about your privacy, opens in a new tab\"]",
    fallbacks: ["role=link[name=/Refer to our Cookie Policy/i]", "text=/Refer to our Cookie Policy/i"],
    stableKey: "4a6bfe8b0467",
  },
  buttonManageCookies: {
    type: "button",
    preferred: "css=#onetrust-pc-btn-handler",
    fallbacks: ["css=button[aria-label=\"Manage Cookies, Opens the preference center dialog\"]", "role=button[name=/Manage Cookies/i]", "text=/Manage Cookies/i"],
    stableKey: "0f178472591e",
  },
  buttonRejectAll: {
    type: "button",
    preferred: "css=#onetrust-reject-all-handler",
    fallbacks: ["role=button[name=/Reject All/i]", "text=/Reject All/i"],
    stableKey: "8baf8f002fbf",
  },
  buttonAcceptAll: {
    type: "button",
    preferred: "css=#onetrust-accept-btn-handler",
    fallbacks: ["role=button[name=/Accept All/i]", "text=/Accept All/i"],
    stableKey: "8d1fd9e1bf53",
  },
} as const;

export type ElementKey = keyof typeof elements;