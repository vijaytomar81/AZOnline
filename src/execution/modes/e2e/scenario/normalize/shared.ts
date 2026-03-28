// src/execution/modes/e2e/scenario/normalize/shared.ts

import { normalizeSpaces } from "@utils/text";

export function getScenarioString(value: unknown): string {
    return normalizeSpaces(String(value ?? ""));
}

export function normalizeScenarioKey(value: unknown): string {
    return getScenarioString(value)
        .toLowerCase()
        .replace(/\s+/g, "");
}
