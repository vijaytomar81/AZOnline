// src/execution/core/logging/e2eScenario/shouldShowStepDebugLines.ts

import type { StepExecutionResult } from "@execution/core/result";

export function shouldShowStepDebugLines(args: {
    verbose?: boolean;
    step: StepExecutionResult;
}): boolean {
    if (args.verbose) {
        return true;
    }

    return args.step.status === "failed";
}
