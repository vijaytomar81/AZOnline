// src/frameworkCore/executionLayer/cli/parsers/execution/parseParallel.ts

import { AppError } from "@utils/errors";
import { normalizeSpaces } from "@utils/text";

export function parseParallel(raw?: string): number {
    const value = normalizeSpaces(String(raw ?? ""));

    if (!value) {
        return 1;
    }

    const num = Number(value);

    if (!Number.isInteger(num) || num <= 0) {
        throw new AppError({
            code: "INVALID_PARALLEL",
            stage: "cli-parse",
            source: "parseParallel",
            message: `Invalid --parallel value "${value}". It must be a positive integer.`,
        });
    }

    return num;
}
