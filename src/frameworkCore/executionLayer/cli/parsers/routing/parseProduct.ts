// src/frameworkCore/executionLayer/cli/parsers/routing/parseProduct.ts

import { AppError } from "@utils/errors";
import { normalizeSpaces } from "@utils/text";
import { normalizeProduct } from "@configLayer/normalizers/normalizeProduct";
import type { Product } from "@configLayer/models/product.config";

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
