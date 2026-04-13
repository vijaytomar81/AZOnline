// src/configLayer/executionStatuses.ts

export const EXECUTION_ITEM_STATUSES = {
    PASSED: "passed",
    FAILED: "failed",
    SKIPPED: "skipped",
    NOT_EXECUTED: "not_executed",
} as const;

export type ExecutionItemStatus =
    typeof EXECUTION_ITEM_STATUSES[keyof typeof EXECUTION_ITEM_STATUSES];

export const EXECUTION_SCENARIO_STATUSES = {
    PASSED: "passed",
    FAILED: "failed",
} as const;

export type ExecutionScenarioStatus =
    typeof EXECUTION_SCENARIO_STATUSES[keyof typeof EXECUTION_SCENARIO_STATUSES];
