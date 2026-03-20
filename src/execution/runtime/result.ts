// src/execution/runtime/result.ts

export type StepExecutionStatus = "passed" | "failed" | "skipped";

export type StepExecutionResult = {
    stepNo: number;
    action: string;
    status: StepExecutionStatus;
    startedAt: string;
    finishedAt: string;
    message?: string;
    details?: Record<string, unknown>;
};

export type ScenarioExecutionResult = {
    scenarioId: string;
    status: StepExecutionStatus;
    stepResults: StepExecutionResult[];
};

export function createStepExecutionResult(args: {
    stepNo: number;
    action: string;
    status: StepExecutionStatus;
    startedAt: string;
    finishedAt: string;
    message?: string;
    details?: Record<string, unknown>;
}): StepExecutionResult {
    return {
        stepNo: args.stepNo,
        action: args.action,
        status: args.status,
        startedAt: args.startedAt,
        finishedAt: args.finishedAt,
        message: args.message,
        details: args.details,
    };
}

export function buildScenarioExecutionResult(args: {
    scenarioId: string;
    stepResults: StepExecutionResult[];
}): ScenarioExecutionResult {
    const hasFailure = args.stepResults.some((r) => r.status === "failed");
    const hasPass = args.stepResults.some((r) => r.status === "passed");

    return {
        scenarioId: args.scenarioId,
        status: hasFailure ? "failed" : hasPass ? "passed" : "skipped",
        stepResults: args.stepResults,
    };
}