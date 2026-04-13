// src/configLayer/uiSeverities.ts

export const UI_SEVERITIES = {
    SUCCESS: "success",
    WARNING: "warning",
    ERROR: "error",
    INFO: "info",
} as const;

export type UISeverity =
    typeof UI_SEVERITIES[keyof typeof UI_SEVERITIES];
