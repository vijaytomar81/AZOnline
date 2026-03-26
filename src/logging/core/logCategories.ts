// src/logging/core/logCategories.ts

export const LOG_CATEGORIES = {
    FRAMEWORK: "framework",
    TECHNICAL: "technical",
    BUSINESS: "business",
    PAGE_ACTION: "page_action",
    PIPELINE: "pipeline",
    VALIDATION: "validation",
    ARTIFACT: "artifact",
    API: "api",
    DIAGNOSTIC: "diagnostic",
} as const;

export type LogCategory =
    (typeof LOG_CATEGORIES)[keyof typeof LOG_CATEGORIES];

export function getAllLogCategories(): LogCategory[] {
    return Object.values(LOG_CATEGORIES);
}