// src/frameworkCore/executionLayer/core/item/buildExecutionItemFailureResult.ts

import { nowIso } from "@utils/time";
import type {
    ExecutionItem,
    ExecutionItemResult,
} from "@frameworkCore/executionLayer/contracts";
import { createExecutionItemResult } from "@frameworkCore/executionLayer/core/result";

export function buildExecutionItemFailureResult(args: {
    item: ExecutionItem;
    startedAt: string;
    message: string;
    outputs?: Record<string, unknown>;
    pageScans?: string[];
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
            subType: args.item.subType ?? "",
            portal: args.item.portal ?? "",
            outputs: args.outputs ?? {},
            errorDetails: args.message,
            pageScans: args.pageScans ?? [],
        },
    });
}
