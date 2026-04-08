// src/frameworkCore/executionLayer/cli/parseRoutingArgs.ts

import { AppError } from "@utils/errors";
import { normalizeSpaces } from "@utils/text";
import { normalizePlatform } from "@configLayer/normalizers/normalizePlatform";
import { normalizeApplication } from "@configLayer/normalizers/normalizeApplication";
import { normalizeProduct } from "@configLayer/normalizers/normalizeProduct";
import type { Platform } from "@configLayer/models/platform.config";
import type { Application } from "@configLayer/models/application.config";
import type { Product } from "@configLayer/models/product.config";

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

export function parseProduct(raw?: string): Product | undefined {
    const value = normalizeSpaces(String(raw ?? ""));

    if (!value) {
        return undefined;
    }

    const resolved = normalizeProduct(value);

    if (resolved) {
        return resolved;
    }

    throw new AppError({
        code: "INVALID_PRODUCT",
        stage: "cli-parse",
        source: "parseProduct",
        message: `Invalid --product value "${raw}".`,
    });
}
