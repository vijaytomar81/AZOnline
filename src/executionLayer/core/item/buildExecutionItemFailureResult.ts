// src/executionLayer/core/item/buildExecutionItemFailureResult.ts

import { nowIso } from "@utils/time";
import type {
    ExecutionItem,
    ExecutionItemResult,
} from "@executionLayer/contracts";
import { createExecutionItemResult } from "@executionLayer/core/result";

export function buildExecutionItemFailureResult(args: {
    item: ExecutionItem;
    startedAt: string;
    message: string;
    debugLines?: string[];
}): ExecutionItemResult {
    return createExecutionItemResult({
        itemNo: args.item.itemNo,
        action: args.item.action,
        status: "failed",
        startedAt: args.startedAt,
        finishedAt: nowIso(),
        message: args.message,
        details: {
            testCaseRef: args.item.testCaseRef,
            debugLines: args.debugLines ?? [],
        },
    });
}
