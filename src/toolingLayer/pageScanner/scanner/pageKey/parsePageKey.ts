// src/toolingLayer/pageScanner/scanner/pageKey/parsePageKey.ts

import { PAGE_KEY_RULES } from "@configLayer/tooling/pageScanner";
import type { PageKeyParts } from "./types";

function invalidPageKeyError(pageKey: string): Error {
    return new Error(
        `Invalid pageKey "${pageKey}" — expected format ${PAGE_KEY_RULES.FORMAT_LABEL}`
    );
}

export function parsePageKey(pageKey: string): PageKeyParts {
    const value = String(pageKey ?? "").trim();

    if (!PAGE_KEY_RULES.PATTERN.test(value)) {
        throw invalidPageKeyError(value);
    }

    const parts = value.split(".");
    if (parts.length !== PAGE_KEY_RULES.SEGMENT_COUNT) {
        throw invalidPageKeyError(value);
    }

    const [platform, application, product, name] = parts;
    if (!platform || !application || !product || !name) {
        throw invalidPageKeyError(value);
    }

    return {
        platform,
        application,
        product,
        name,
        namespace: `${platform}.${application}.${product}`,
    };
}
