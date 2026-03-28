// src/execution/journeys/newBusiness/core/normalizeStartFromKey.ts

import { normalizeSpaces } from "@utils/text";

export function normalizeStartFromKey(value?: string): string {
    return normalizeSpaces(String(value ?? ""))
        .toLowerCase()
        .replace(/\s+/g, "");
}
