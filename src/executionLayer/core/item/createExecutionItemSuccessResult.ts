// src/executionLayer/core/item/createExecutionItemSuccessResult.ts

import { nowIso } from "@utils/time";
import type {
    ExecutionItem,
    ExecutionItemResult,
    ResolvedExecutionItemData,
} from "@executionLayer/contracts";
import { createExecutionItemResult } from "@executionLayer/core/result";

export function createExecutionItemSuccessResult(args: {
    item: ExecutionItem;
    startedAt: string;
    resolved: ResolvedExecutionItemData;
    debugLines: string[];
}): ExecutionItemResult {
    return createExecutionItemResult({
        itemNo: args.item.itemNo,
        action: args.item.action,
        status: "passed",
        startedAt: args.startedAt,
        finishedAt: nowIso(),
        details: {
            testCaseRef: args.resolved.testCaseRef,
            sourceSheet: args.resolved.sourceFileSheet,
            sourceAction: args.resolved.source.action,
            debugLines: args.debugLines,
        },
    });
}
