// src/executionLayer/core/item/createExecutionItemSuccessResult.ts

import { nowIso } from "@utils/time";
import type {
    ExecutionItem,
    ExecutionItemResult,
    ResolvedExecutionItemData,
} from "@frameworkCore/executionLayer/contracts";
import { createExecutionItemResult } from "@frameworkCore/executionLayer/core/result";

export function createExecutionItemSuccessResult(args: {
    item: ExecutionItem;
    startedAt: string;
    resolved: ResolvedExecutionItemData;
    outputs: Record<string, unknown>;
}): ExecutionItemResult {
    return createExecutionItemResult({
        itemNo: args.item.itemNo,
        action: args.item.action,
        status: "passed",
        startedAt: args.startedAt,
        finishedAt: nowIso(),
        details: {
            testCaseRef: args.resolved.testCaseRef,
            outputs: args.outputs,
            errorDetails: "",
            pageScans: [],
        },
    });
}
