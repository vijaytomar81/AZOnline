// src/frameworkCore/executionLayer/cli/parsers/execution/parseIterations.ts

import { normalizeSpaces } from "@utils/text";

export function parseIterations(raw?: string): number {
    const value = normalizeSpaces(String(raw ?? ""));

    if (!value) {
        return 1;
    }

    const num = Number(value);

    if (!Number.isInteger(num) || num <= 0) {
        return 1;
    }

    return num;
}
