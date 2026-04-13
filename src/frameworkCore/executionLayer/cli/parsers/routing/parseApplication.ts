// src/frameworkCore/executionLayer/cli/parsers/routing/parseApplication.ts

import { AppError } from "@utils/errors";
import { normalizeSpaces } from "@utils/text";
import { normalizeApplication } from "@configLayer/normalizers/normalizeApplication";
import type { Application } from "@configLayer/models/application.config";

export function parseApplication(raw?: string): Application | undefined {
    const value = normalizeSpaces(String(raw ?? ""));

    if (!value) {
        return undefined;
    }

    const resolved = normalizeApplication(value);

    if (resolved) {
        return resolved;
    }

    throw new AppError({
        code: "INVALID_APPLICATION",
        stage: "cli-parse",
        source: "parseApplication",
        message: `Invalid --application value "${raw}".`,
    });
}
