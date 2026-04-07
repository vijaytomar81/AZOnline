// src/executionLayer/mode/e2e/scenario/normalize/shared.ts

import { normalizeSpaces } from "@utils/text";

export function getString(value: unknown): string {
    return normalizeSpaces(String(value ?? ""));
}

export function normalizeKey(value: unknown): string {
    return getString(value).toLowerCase().replace(/\s+/g, "");
}
