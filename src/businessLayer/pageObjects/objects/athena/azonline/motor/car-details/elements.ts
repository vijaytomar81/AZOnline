// src/businessLayer/pageObjects/objects/athena/azonline/motor/car-details/elements.ts
// pageKey: athena.azonline.motor.car-details
// scannedAt: 2026-04-16T19:49:15.528Z

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
  linkPersonalInfoUse: {
    type: "link",
    preferred: "css=#personal-info-use",
    fallbacks: ["role=link[name=/view how we’ll use your info/i]", "text=/view how we’ll use your info/i"],
    stableKey: "4e4c1caed32c",
  },
  radioRegistrationNumberPolarQuestionYes: {
    type: "radio",
    preferred: "css=#registrationNumberPolarQuestionfalse",
    fallbacks: ["css=input[name=\"registrationNumberPolarQuestion\"]", "role=textbox[name=/Yes/i]"],
    stableKey: "e08447a314e2",
  },
  radioRegistrationNumberPolarQuestionNo: {
    type: "radio",
    preferred: "css=#registrationNumberPolarQuestiontrue",
    fallbacks: ["css=input[name=\"registrationNumberPolarQuestion\"]", "role=textbox[name=/No/i]"],
    stableKey: "24a54bc12692",
  },
  inputRegistrationNumber: {
    type: "input",
    preferred: "css=#registrationNumber",
    fallbacks: ["role=textbox[name=/What’s your car registration number\\?/i]"],
    stableKey: "79fedb18806c",
  },
  buttonFindMyCar: {
    type: "button",
    preferred: "role=button[name=/Find my car/i]",
    fallbacks: ["text=/Find my car/i"],
    stableKey: "9138f85cc924",
  },
  groupRadioRegistrationNumberPolarQuestion: {
    type: "radio-group",
    preferred: "",
    fallbacks: [],
  },
} as const;

export type ElementKey = keyof typeof elements;