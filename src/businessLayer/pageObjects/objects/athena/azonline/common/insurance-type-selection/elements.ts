// src/businessLayer/pageObjects/objects/athena/azonline/common/insurance-type-selection/elements.ts
// pageKey: athena.azonline.common.insurance-type-selection
// scannedAt: 2026-03-13T10:57:20.737Z

export type ElementDef = {
  type: string;
  preferred: string;
  fallbacks: readonly string[];
  stableKey?: string;
};

export const elements = {
  linkToAllianzHomePage: {
    type: "link",
    preferred: "css=#goToAllianzHomePage",
    fallbacks: ["css=a[aria-label=\"Link to Allianz home page\"]", "role=link[name=/Link to Allianz home page/i]"],
    stableKey: "a49b80f2b5e9",
  },
  buttonInputBack: {
    type: "button",
    preferred: "role=button[name=/Back/i]",
    fallbacks: ["text=/Back/i"],
    stableKey: "8ebb2ee7d230",
  },
  linkCarQuote: {
    type: "link",
    preferred: "css=#viewSavedSubscriptionCarQuotes",
    fallbacks: ["role=link[name=/Car quote/i]", "text=/Car quote/i"],
    stableKey: "273843c5aa23",
  },
  linkHomeQuote: {
    type: "link",
    preferred: "css=#viewSavedSubscriptionHomeQuotes",
    fallbacks: ["role=link[name=/Home quote/i]", "text=/Home quote/i"],
    stableKey: "6d720003f394",
  },
  linkTermsAndConditionsApply: {
    type: "link",
    preferred: "role=link[name=/T&Cs apply/i]",
    fallbacks: ["text=/T&Cs apply/i"],
    stableKey: "b2536f31be95",
  },
  linkLetUsKnow: {
    type: "link",
    preferred: "css=#renewal-date-capture-link",
    fallbacks: ["role=link[name=/Let us know/i]", "text=/Let us know/i"],
    stableKey: "b4db5fa6a06b",
  },
  linkInputBack: {
    type: "link",
    preferred: "role=link[name=/Back/i]",
    fallbacks: ["text=/Back/i"],
    stableKey: "db022e0e13e1",
  },
} as const;

export type ElementKey = keyof typeof elements;