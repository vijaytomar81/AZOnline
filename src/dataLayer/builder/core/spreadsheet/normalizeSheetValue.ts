// src/dataLayer/builder/core/spreadsheet/normalizeSheetValue.ts

import { normalizeHeaderKey, normalizeSpaces } from "@utils/text";

export function norm(value: string): string {
    return normalizeSpaces(String(value ?? ""));
}

export function normKey(value: string): string {
    return normalizeHeaderKey(value);
}