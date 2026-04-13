// src/configLayer/tooling/validation.ts

import { UI_SEVERITIES, type UISeverity } from "@configLayer/core/uiSeverities";

export const VALIDATION_SEVERITIES = {
    INFO: "INFO",
    WARN: "WARN",
    ERROR: "ERROR",
} as const;

export type ValidationSeverity =
    typeof VALIDATION_SEVERITIES[keyof typeof VALIDATION_SEVERITIES];

export const VALIDATION_REPORT_SEVERITIES = {
    ERROR: UI_SEVERITIES.ERROR,
    WARNING: UI_SEVERITIES.WARNING,
    SUCCESS: UI_SEVERITIES.SUCCESS,
} as const;

export type ValidationReportSeverity =
    typeof VALIDATION_REPORT_SEVERITIES[keyof typeof VALIDATION_REPORT_SEVERITIES];

export const REGISTRY_FILE_NAMES = {
    INDEX: "index.ts",
    PAGE_MANAGER: "pageManager.ts",
} as const;

export type RegistryFileName =
    typeof REGISTRY_FILE_NAMES[keyof typeof REGISTRY_FILE_NAMES];