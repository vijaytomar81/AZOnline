// src/execution/journeys/newBusiness/core/buildPolicyNumber.ts

import { nowIso } from "@utils/time";

export function buildPolicyNumber(): string {
    const stamp = nowIso().replace(/[-:TZ.]/g, "").slice(0, 14);
    return `AUTO${stamp}`;
}
