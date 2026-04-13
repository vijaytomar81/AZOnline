// src/frameworkCore/executionLayer/cli/parsers/routing/parsePlatform.ts

import { AppError } from "@utils/errors";
import { normalizeSpaces } from "@utils/text";
import { normalizePlatform } from "@configLayer/normalizers/normalizePlatform";
import type { Platform } from "@configLayer/models/platform.config";

export function parsePlatform(raw?: string): Platform | undefined {
    const value = normalizeSpaces(String(raw ?? ""));

    if (!value) {
        return undefined;
    }

    const resolved = normalizePlatform(value);

    if (resolved) {
        return resolved;
    }

    throw new AppError({
        code: "INVALID_PLATFORM",
        stage: "cli-parse",
        source: "parsePlatform",
        message: `Invalid --platform value "${raw}".`,
    });
}
