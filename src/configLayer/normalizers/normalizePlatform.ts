// src/configLayer/normalizers/normalizePlatform.ts

import { normalizeLookupKey } from "@utils/text";
import { PLATFORMS, type Platform } from "../models/platform.config";

/* =========================================================
 * 🔁 LOOKUP TABLE
 * ======================================================= */

const PLATFORM_LOOKUP: Record<string, Platform> = {
    athena: PLATFORMS.ATHENA,
    pcw: PLATFORMS.PCW,
    pcwtool: PLATFORMS.PCW_TOOL,
};

/* =========================================================
 * 🚀 PUBLIC API
 * ======================================================= */

export function normalizePlatform(
    raw?: string
): Platform | undefined {
    return PLATFORM_LOOKUP[normalizeLookupKey(raw)];
}
