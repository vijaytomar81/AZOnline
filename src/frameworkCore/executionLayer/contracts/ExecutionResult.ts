// src/frameworkCore/executionLayer/contracts/ExecutionResult.ts

import {
    EXECUTION_ITEM_STATUSES,
    EXECUTION_SCENARIO_STATUSES,
    type ExecutionItemStatus,
    type ExecutionScenarioStatus,
} from "@configLayer/core/executionStatuses";

export type { ExecutionItemStatus, ExecutionScenarioStatus };

export type ExecutionItemDetails = {
    testCaseRef?: string;
    sourceSheet?: string;
    sourceAction?: string;
    debugLines?: string[];
    pageScans?: string[];
    [key: string]: unknown;
};

export type ExecutionItemResult = {
    itemNo: number;
    action: string;
    status: ExecutionItemStatus;
    startedAt: string;
    finishedAt: string;
    message?: string;
    details?: ExecutionItemDetails;
};

export type ExecutionScenarioResult = {
    scenarioId: string;
    status: ExecutionScenarioStatus;
    itemResults: ExecutionItemResult[];
    outputs?: Record<string, unknown>;
};

export function createExecutionItemResult(
    input: ExecutionItemResult
): ExecutionItemResult {
    return input;
}

export function buildExecutionScenarioResult(input: {
    scenarioId: string;
    itemResults: ExecutionItemResult[];
    outputs?: Record<string, unknown>;
}): ExecutionScenarioResult {
    const hasFailure = input.itemResults.some(
        (item) => item.status === EXECUTION_ITEM_STATUSES.FAILED
    );

    return {
        scenarioId: input.scenarioId,
        status: hasFailure
            ? EXECUTION_SCENARIO_STATUSES.FAILED
            : EXECUTION_SCENARIO_STATUSES.PASSED,
        itemResults: input.itemResults,
        outputs: input.outputs ?? {},
    };
}