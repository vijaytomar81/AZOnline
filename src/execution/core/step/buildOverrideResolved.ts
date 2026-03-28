// src/execution/core/step/buildOverrideResolved.ts

import type { ScenarioStep } from "@execution/modes/e2e/scenario/types";

export type ResolvedStepExecutionData = {
    testCaseId: string;
    payload: Record<string, unknown>;
    source: {
        action: string;
        sheetName: string;
    };
    sourceFileSheet: string;
};

export function buildOverrideResolved(
    step: ScenarioStep,
    payload: Record<string, unknown>
): ResolvedStepExecutionData {
    return {
        testCaseId: step.testCaseId,
        payload,
        source: {
            action: step.action,
            sheetName: "data-mode",
        },
        sourceFileSheet: "data-mode",
    };
}
