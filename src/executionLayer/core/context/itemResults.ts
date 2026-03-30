// src/executionLayer/core/context/itemResults.ts

import type {
    ExecutionContext,
    ExecutionItemResult,
} from "@executionLayer/contracts";

export function addExecutionItemResult(
    context: ExecutionContext,
    result: ExecutionItemResult
): void {
    context.itemResults.push(result);
}
