// src/execution/journeys/newBusiness/core/buildQuoteNumber.ts

import { nowIso } from "@utils/time";

export function buildQuoteNumber(): string {
    const stamp = nowIso().replace(/[-:TZ.]/g, "").slice(2, 14);
    return `Q${stamp}`;
}
