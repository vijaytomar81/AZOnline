// src/executionLayer/contracts/ExecutionResult.ts

export type ExecutionItemStatus = "passed" | "failed" | "skipped";
export type ExecutionScenarioStatus = "passed" | "failed";

export type ExecutionItemDetails = {
    testCaseRef?: string;
    sourceSheet?: string;
    sourceAction?: string;
    debugLines?: string[];
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
    const hasFailure = input.itemResults.some((item) => item.status === "failed");

    return {
        scenarioId: input.scenarioId,
        status: hasFailure ? "failed" : "passed",
        itemResults: input.itemResults,
        outputs: input.outputs ?? {},
    };
}
