// src/frameworkCore/executionLayer/core/item/buildOverrideResolved.ts

import type {
    ExecutionItem,
    ResolvedExecutionItemData,
} from "@frameworkCore/executionLayer/contracts";

export function buildOverrideResolved(
    item: ExecutionItem,
    payload: Record<string, unknown>
): ResolvedExecutionItemData {
    return {
        testCaseRef: item.testCaseRef,
        payload,
        source: {
            action: item.action,
            subType: item.subType,
        },
    };
}
