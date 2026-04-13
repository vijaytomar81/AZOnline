// src/configLayer/executionModes.ts

export const EXECUTION_MODES = {
    E2E: "e2e",
    DATA: "data",
} as const;

export type ExecutionMode =
    typeof EXECUTION_MODES[keyof typeof EXECUTION_MODES];
