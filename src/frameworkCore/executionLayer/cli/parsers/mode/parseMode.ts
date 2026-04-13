// src/frameworkCore/executionLayer/cli/parsers/mode/parseMode.ts

import {
    EXECUTION_MODES,
    type ExecutionMode,
} from "@configLayer/executionModes";

export function parseMode(raw?: string): ExecutionMode {
    return String(raw ?? EXECUTION_MODES.E2E).trim().toLowerCase() === EXECUTION_MODES.DATA
        ? EXECUTION_MODES.DATA
        : EXECUTION_MODES.E2E;
}
