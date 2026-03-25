// src/execution/core/result.ts

export type StepExecutionStatus = "passed" | "failed" | "skipped";
export type ScenarioExecutionStatus = "passed" | "failed";

export type StepExecutionDetails = {
    testCaseId?: string;
    sourceSheet?: string;
    sourceAction?: string;
    debugLines?: string[];
    [key: string]: unknown;
};

export type StepExecutionResult = {
    stepNo: number;
    action: string;
    status: StepExecutionStatus;
    startedAt: string;
    finishedAt: string;
    message?: string;
    details?: StepExecutionDetails;
};

export type ScenarioExecutionResult = {
    scenarioId: string;
    status: ScenarioExecutionStatus;
    stepResults: StepExecutionResult[];
    outputs?: Record<string, unknown>;
};

export function createStepExecutionResult(
    input: StepExecutionResult
): StepExecutionResult {
    return input;
}

export function buildScenarioExecutionResult(input: {
    scenarioId: string;
    stepResults: StepExecutionResult[];
    outputs?: Record<string, unknown>;
}): ScenarioExecutionResult {
    const hasFailure = input.stepResults.some((item) => item.status === "failed");

    return {
        scenarioId: input.scenarioId,
        status: hasFailure ? "failed" : "passed",
        stepResults: input.stepResults,
        outputs: input.outputs ?? {},
    };
}