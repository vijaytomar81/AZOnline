// src/frameworkCore/executionLayer/mode/e2e/scenario/validate/shared.ts

export function normalizeValidationKey(value?: string): string {
    return String(value ?? "").trim().toLowerCase().replace(/\s+/g, "");
}
