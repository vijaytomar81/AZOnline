// src/executionLayer/runtime/itemData/utils/normalizeResolverKey.ts

import { normalizeSpaces } from "@utils/text";

export function normalizeResolverKey(value?: string): string {
    return normalizeSpaces(String(value ?? ""))
        .toLowerCase()
        .replace(/\s+/g, "");
}
