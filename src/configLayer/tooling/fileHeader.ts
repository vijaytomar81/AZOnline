// src/configLayer/tooling/fileHeader.ts

export const HEADER_CHECK_MODES = {
    CHECK: "checkMode",
    FIX: "fixMode",
} as const;

export type HeaderCheckMode =
    typeof HEADER_CHECK_MODES[keyof typeof HEADER_CHECK_MODES];

export const HEADER_FIX_STATUSES = {
    OK: "ok",
    MISSING: "missing",
    INCORRECT: "incorrect",
} as const;

export type HeaderFixStatus =
    typeof HEADER_FIX_STATUSES[keyof typeof HEADER_FIX_STATUSES];