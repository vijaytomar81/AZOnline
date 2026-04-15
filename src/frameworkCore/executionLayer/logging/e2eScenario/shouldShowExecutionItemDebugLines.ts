// src/frameworkCore/executionLayer/logging/e2eScenario/shouldShowExecutionItemDebugLines.ts

import type { ExecutionItemResult } from "@frameworkCore/executionLayer/contracts";

export function shouldShowExecutionItemDebugLines(args: {
    verbose?: boolean;
    item: ExecutionItemResult;
}): boolean {
    if (args.verbose) {
        return true;
    }

    return args.item.status === "failed";
}
