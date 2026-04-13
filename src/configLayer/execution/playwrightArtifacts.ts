// src/configLayer/execution/playwrightArtifacts.ts

export const SCREENSHOT_MODES = {
    ON: "on",
    OFF: "off",
    ONLY_ON_FAILURE: "only-on-failure",
} as const;

export type ScreenshotMode =
    typeof SCREENSHOT_MODES[keyof typeof SCREENSHOT_MODES];

export const VIDEO_MODES = {
    ON: "on",
    OFF: "off",
    RETAIN_ON_FAILURE: "retain-on-failure",
} as const;

export type VideoMode =
    typeof VIDEO_MODES[keyof typeof VIDEO_MODES];

export const TRACE_MODES = {
    ON: "on",
    OFF: "off",
    RETAIN_ON_FAILURE: "retain-on-failure",
} as const;

export type TraceMode =
    typeof TRACE_MODES[keyof typeof TRACE_MODES];
