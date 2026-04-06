// src/config/domain/product.resolver.ts

import { normalizeSpaces } from "@utils/text";
import type { Product } from "./routing.config";
import {
    PRODUCT_RAW_VALUE_MAP,
    PRODUCT_SOURCE_RULES,
} from "./product.inference.config";

function normalizeKey(value?: string): string {
    return normalizeSpaces(String(value ?? ""))
        .toLowerCase()
        .replace(/\s+/g, "");
}

function matchesTokenRule(value: string, tokens: string[]): boolean {
    return tokens.some((token) => value.includes(normalizeKey(token)));
}

export function resolveProductFromRaw(
    raw?: string
): Product | undefined {
    const value = normalizeKey(raw);

    if (!value) {
        return undefined;
    }

    return PRODUCT_RAW_VALUE_MAP[value];
}

export function inferProductFromSourceOrSchema(args: {
    source?: string;
    schemaName?: string;
}): Product | undefined {
    const candidates = [
        normalizeKey(args.source),
        normalizeKey(args.schemaName),
    ].filter(Boolean);

    if (!candidates.length) {
        return undefined;
    }

    const match = PRODUCT_SOURCE_RULES.find((rule) =>
        candidates.some((candidate) =>
            matchesTokenRule(candidate, rule.tokens)
        )
    );

    return match?.product;
}
