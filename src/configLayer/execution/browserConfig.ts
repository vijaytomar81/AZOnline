// src/configLayer/execution/browserConfig.ts

export const BROWSER_NAMES = {
    CHROMIUM: "chromium",
    FIREFOX: "firefox",
    WEBKIT: "webkit",
} as const;

export type BrowserName =
    typeof BROWSER_NAMES[keyof typeof BROWSER_NAMES];

export const BROWSER_CHANNELS = {
    MSEDGE: "msedge",
    CHROME: "chrome",
} as const;

export type BrowserChannel =
    typeof BROWSER_CHANNELS[keyof typeof BROWSER_CHANNELS];
