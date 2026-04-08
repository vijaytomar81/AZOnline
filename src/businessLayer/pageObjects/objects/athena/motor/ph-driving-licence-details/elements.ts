// src/businessLayer/pageObjects/objects/athena/motor/ph-driving-licence-details/elements.ts
// pageKey: athena.motor.ph-driving-licence-details
// scannedAt: 2026-03-13T17:03:49.922Z

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
  radioDrivingLicenceHandyyes: {
    type: "radio",
    preferred: "css=#drivingLicenceHandytrue",
    fallbacks: ["css=input[name=\"drivingLicenceHandy\"]", "role=textbox[name=/Yes/i]"],
    stableKey: "85190e7e5213",
  },
  radioDrivingLicenceHandyno: {
    type: "radio",
    preferred: "css=#drivingLicenceHandyfalse",
    fallbacks: ["css=input[name=\"drivingLicenceHandy\"]", "role=textbox[name=/No/i]"],
    stableKey: "342557dc5a01",
  },
  selectTitleQuestion: {
    type: "select",
    preferred: "css=#titleQuestion",
    fallbacks: ["role=combobox[name=/Title/i]"],
    stableKey: "71705cf89268",
  },
  inputFirstName: {
    type: "input",
    preferred: "css=#firstName",
    fallbacks: ["role=textbox[name=/First name/i]"],
    stableKey: "48fd355dcf23",
  },
  inputLastName: {
    type: "input",
    preferred: "css=#lastName",
    fallbacks: ["role=textbox[name=/Last name/i]"],
    stableKey: "c02986d4ff14",
  },
  inputDateOfBirthDay: {
    type: "input",
    preferred: "css=#dateOfBirth-day",
    fallbacks: ["css=input[aria-label=\"day\"]", "css=input[placeholder=\"DD\"]", "role=textbox[name=/day/i]"],
    stableKey: "e4b4a61e0baf",
  },
  inputDateOfBirthMonth: {
    type: "input",
    preferred: "css=#dateOfBirth-month",
    fallbacks: ["css=input[aria-label=\"month\"]", "css=input[placeholder=\"MM\"]", "role=textbox[name=/month/i]"],
    stableKey: "093554278f80",
  },
  inputDateOfBirthYear: {
    type: "input",
    preferred: "css=#dateOfBirth-year",
    fallbacks: ["css=input[aria-label=\"year\"]", "css=input[placeholder=\"YYYY\"]", "role=textbox[name=/year/i]"],
    stableKey: "4e5ab4e8a6f2",
  },
  inputAddressLookupWidgetAddressLookupQuestionInputBuilding: {
    type: "input",
    preferred: "css=#addressLookupWidget-addressLookupQuestionInput-building",
    fallbacks: ["role=textbox[name=/addressLookupWidget-addressLookupQuestionInput-building/i]"],
    stableKey: "00c1fa010435",
  },
  inputAddressLookupWidgetAddressLookupQuestionInputPostcode: {
    type: "input",
    preferred: "css=#addressLookupWidget-addressLookupQuestionInput-postcode",
    fallbacks: ["role=textbox[name=/addressLookupWidget-addressLookupQuestionInput-postcode/i]"],
    stableKey: "a4f628a60a4c",
  },
  buttonFindAddress: {
    type: "button",
    preferred: "css=#find-address",
    fallbacks: ["role=button[name=/Find address/i]", "text=/Find address/i"],
    stableKey: "0cf50454b1e1",
  },
  selectAddressLookupQuestionInput: {
    type: "select",
    preferred: "css=#addressLookupQuestionInput",
    fallbacks: ["role=combobox[name=/Address/i]"],
    stableKey: "7d3d891a766c",
  },
  radioDrivingLicenceTypesukFull: {
    type: "radio",
    preferred: "css=#drivingLicenceTypes1",
    fallbacks: ["css=input[name=\"drivingLicenceTypes\"]", "role=textbox[name=/UK Full/i]"],
    stableKey: "e074d5634d50",
  },
  radioDrivingLicenceTypesukFullAutomaticOnly: {
    type: "radio",
    preferred: "css=#drivingLicenceTypes2",
    fallbacks: ["css=input[name=\"drivingLicenceTypes\"]", "role=textbox[name=/UK Full - Automatic only/i]"],
    stableKey: "d6beeedffaa9",
  },
  radioDrivingLicenceTypesukProvisional: {
    type: "radio",
    preferred: "css=#drivingLicenceTypes3",
    fallbacks: ["css=input[name=\"drivingLicenceTypes\"]", "role=textbox[name=/UK Provisional/i]"],
    stableKey: "2abfb28f2396",
  },
  radioDrivingLicenceTypeseuFull: {
    type: "radio",
    preferred: "css=#drivingLicenceTypes4",
    fallbacks: ["css=input[name=\"drivingLicenceTypes\"]", "role=textbox[name=/EU Full/i]"],
    stableKey: "e942d639a797",
  },
  radioDrivingLicenceTypeseuProvisional: {
    type: "radio",
    preferred: "css=#drivingLicenceTypes5",
    fallbacks: ["css=input[name=\"drivingLicenceTypes\"]", "role=textbox[name=/EU Provisional/i]"],
    stableKey: "865eeaef4b9b",
  },
  radioDrivingLicenceTypesother: {
    type: "radio",
    preferred: "css=#drivingLicenceTypes6",
    fallbacks: ["css=input[name=\"drivingLicenceTypes\"]", "role=textbox[name=/Other/i]"],
    stableKey: "02e32ed6e04d",
  },
  selectDrivingExpirience: {
    type: "select",
    preferred: "css=#drivingExpirience",
    fallbacks: ["role=combobox[name=/How long have you held your licence for\\?/i]"],
    stableKey: "514030ddac4b",
  },
  radioHasConvictionsQuestionyes: {
    type: "radio",
    preferred: "css=#hasConvictionsQuestiontrue",
    fallbacks: ["css=input[name=\"hasConvictionsQuestion\"]", "role=textbox[name=/Yes/i]"],
    stableKey: "4a8f6dc50477",
  },
  radioHasConvictionsQuestionno: {
    type: "radio",
    preferred: "css=#hasConvictionsQuestionfalse",
    fallbacks: ["css=input[name=\"hasConvictionsQuestion\"]", "role=textbox[name=/No/i]"],
    stableKey: "991102a832da",
  },
  inputConviction1DateMonth: {
    type: "input",
    preferred: "css=#conviction_1_date-month",
    fallbacks: ["css=input[aria-label=\"Month input field\"]", "css=input[placeholder=\"MM\"]", "role=textbox[name=/Month input field/i]"],
    stableKey: "61e5d9b6f912",
  },
  inputConviction1DateYear: {
    type: "input",
    preferred: "css=#conviction_1_date-year",
    fallbacks: ["css=input[aria-label=\"Year input field\"]", "css=input[placeholder=\"YYYY\"]", "role=textbox[name=/Year input field/i]"],
    stableKey: "67fb160ac359",
  },
  searchSelectTheConvictionCode: {
    type: "input",
    preferred: "css=#react-select-2-input",
    fallbacks: ["role=textbox[name=/react-select-2-input/i]"],
    stableKey: "04a163268e53",
  },
  radioConviction0ResultedToABanyes: {
    type: "radio",
    preferred: "css=#Conviction0ResultedToABantrue",
    fallbacks: ["css=input[name=\"Conviction0ResultedToABan\"]", "role=textbox[name=/Yes/i]"],
    stableKey: "3663e0bdf123",
  },
  radioConviction0ResultedToABanno: {
    type: "radio",
    preferred: "css=#Conviction0ResultedToABanfalse",
    fallbacks: ["css=input[name=\"Conviction0ResultedToABan\"]", "role=textbox[name=/No/i]"],
    stableKey: "2774de301608",
  },
  linkRemoveConviction: {
    type: "link",
    preferred: "role=link[name=/Remove conviction/i]",
    fallbacks: ["text=/Remove conviction/i"],
    stableKey: "8ef186ee3d20",
  },
  inputConviction2DateMonth: {
    type: "input",
    preferred: "css=#conviction_2_date-month",
    fallbacks: ["css=input[aria-label=\"Month input field\"]", "css=input[placeholder=\"MM\"]", "role=textbox[name=/Month input field/i]"],
    stableKey: "d836ccd43e6e",
  },
  inputConviction2DateYear: {
    type: "input",
    preferred: "css=#conviction_2_date-year",
    fallbacks: ["css=input[aria-label=\"Year input field\"]", "css=input[placeholder=\"YYYY\"]", "role=textbox[name=/Year input field/i]"],
    stableKey: "a7e5d02af331",
  },
  searchSelectTheConvictionCode2: {
    type: "input",
    preferred: "css=#react-select-3-input",
    fallbacks: ["role=textbox[name=/react-select-3-input/i]"],
    stableKey: "61518ae35236",
  },
  radioConviction1ResultedToABanyes: {
    type: "radio",
    preferred: "css=#Conviction1ResultedToABantrue",
    fallbacks: ["css=input[name=\"Conviction1ResultedToABan\"]", "role=textbox[name=/Yes/i]"],
    stableKey: "02aa132063b2",
  },
  radioConviction1ResultedToABanno: {
    type: "radio",
    preferred: "css=#Conviction1ResultedToABanfalse",
    fallbacks: ["css=input[name=\"Conviction1ResultedToABan\"]", "role=textbox[name=/No/i]"],
    stableKey: "ef634c424b5a",
  },
  linkRemoveConviction2: {
    type: "link",
    preferred: "role=link[name=/Remove conviction/i]",
    fallbacks: ["text=/Remove conviction/i"],
    stableKey: "8ef186ee3d20",
  },
  inputConviction3DateMonth: {
    type: "input",
    preferred: "css=#conviction_3_date-month",
    fallbacks: ["css=input[aria-label=\"Month input field\"]", "css=input[placeholder=\"MM\"]", "role=textbox[name=/Month input field/i]"],
    stableKey: "bd2e81f8891b",
  },
  inputConviction3DateYear: {
    type: "input",
    preferred: "css=#conviction_3_date-year",
    fallbacks: ["css=input[aria-label=\"Year input field\"]", "css=input[placeholder=\"YYYY\"]", "role=textbox[name=/Year input field/i]"],
    stableKey: "4bbbc597a1dc",
  },
  searchSelectTheConvictionCode3: {
    type: "input",
    preferred: "css=#react-select-4-input",
    fallbacks: ["role=textbox[name=/react-select-4-input/i]"],
    stableKey: "c2c22e2f4751",
  },
  radioConviction2ResultedToABanyes: {
    type: "radio",
    preferred: "css=#Conviction2ResultedToABantrue",
    fallbacks: ["css=input[name=\"Conviction2ResultedToABan\"]", "role=textbox[name=/Yes/i]"],
    stableKey: "a688eebcf3e3",
  },
  radioConviction2ResultedToABanno: {
    type: "radio",
    preferred: "css=#Conviction2ResultedToABanfalse",
    fallbacks: ["css=input[name=\"Conviction2ResultedToABan\"]", "role=textbox[name=/No/i]"],
    stableKey: "94ec9889fc23",
  },
  linkRemoveConviction3: {
    type: "link",
    preferred: "role=link[name=/Remove conviction/i]",
    fallbacks: ["text=/Remove conviction/i"],
    stableKey: "8ef186ee3d20",
  },
  buttonNavigatorNext: {
    type: "button",
    preferred: "css=#navigatorNext",
    fallbacks: ["role=button[name=/Next/i]", "text=/Next/i"],
    stableKey: "44dc406f64a9",
  },
  buttonNavigatorBack: {
    type: "button",
    preferred: "css=#navigatorBack",
    fallbacks: ["role=link[name=/Back/i]", "text=/Back/i"],
    stableKey: "9b7b267f10a1",
  },
  groupRadioDrivingLicenceHandy: {
    type: "radio-group",
    preferred: "",
    fallbacks: [],
  },
  groupRadioDrivingLicenceTypes: {
    type: "radio-group",
    preferred: "",
    fallbacks: [],
  },
  groupRadioHasConvictionsQuestion: {
    type: "radio-group",
    preferred: "",
    fallbacks: [],
  },
  groupRadioConviction0ResultedToABan: {
    type: "radio-group",
    preferred: "",
    fallbacks: [],
  },
  groupRadioConviction1ResultedToABan: {
    type: "radio-group",
    preferred: "",
    fallbacks: [],
  },
  groupRadioConviction2ResultedToABan: {
    type: "radio-group",
    preferred: "",
    fallbacks: [],
  },
  buttonAddAnotherConviction: {
    type: "button",
    preferred: "css=#addAnotherConvictionButton",
    fallbacks: ["css=button[name=\"addAnotherConvictionButton\"]", "role=button[name=/Add another conviction/i]", "text=/Add another conviction/i"],
    stableKey: "b5a2399a7e10",
  },
} as const;

export type ElementKey = keyof typeof elements;