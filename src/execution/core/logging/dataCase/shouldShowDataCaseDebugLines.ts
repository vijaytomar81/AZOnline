// src/execution/core/logging/dataCase/shouldShowDataCaseDebugLines.ts

import type { ScenarioExecutionResult } from "@execution/core/result";

export function shouldShowDataCaseDebugLines(args: {
    verbose?: boolean;
    result: ScenarioExecutionResult;
}): boolean {
    if (args.verbose) {
        return true;
    }

    return args.result.status === "failed";
}
