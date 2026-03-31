// src/executionLayer/core/item/buildOverrideResolved.ts

import type {
    ExecutionItem,
    ResolvedExecutionItemData,
} from "@executionLayer/contracts";

export function buildOverrideResolved(
    item: ExecutionItem,
    payload: Record<string, unknown>
): ResolvedExecutionItemData {
    return {
        testCaseRef: item.testCaseRef,
        payload,
        source: {
            action: item.action,
            sheetName: "data-mode",
        },
        sourceFileSheet: "data-mode",
    };
}
