// src/executionLayer/logging/dataCase/shouldShowDataCaseDebugLines.ts

import type { ExecutionScenarioResult } from "@frameworkCore/executionLayer/contracts";

export function shouldShowDataCaseDebugLines(args: {
    verbose?: boolean;
    result: ExecutionScenarioResult;
}): boolean {
    if (args.verbose) {
        return true;
    }

    return args.result.status === "failed";
}
