// src/executionLayer/core/scenario/runScenarioItems.ts

import { nowIso } from "@utils/time";
import type {
    ExecutionContext,
    ExecutionItem,
    ExecutionItemResult,
} from "@executionLayer/contracts";
import type { ExecutorRegistry } from "@executionLayer/core/registry";
import { addExecutionItemResult } from "@executionLayer/core/context";
import { createExecutionItemResult } from "@executionLayer/core/result";
import type { ExecutionItemDataRegistry } from "@executionLayer/runtime/itemData";
import { runExecutionItem } from "@executionLayer/core/item";

function createNotExecutedItemResult(item: ExecutionItem): ExecutionItemResult {
    const timestamp = nowIso();

    return createExecutionItemResult({
        itemNo: item.itemNo,
        action: item.action,
        status: "not_executed",
        startedAt: timestamp,
        finishedAt: timestamp,
        message: "Not executed because a previous item failed.",
        details: {
            testCaseRef: item.testCaseRef,
            outputs: {},
            errorDetails: "Not executed because a previous item failed.",
        },
    });
}

export async function runScenarioItems(args: {
    context: ExecutionContext;
    registry: ExecutorRegistry;
    executionItemDataRegistry: ExecutionItemDataRegistry;
    logScope: string;
    overrideItemData?: Record<string, unknown>;
    stopOnFailure?: boolean;
}): Promise<void> {
    const stopOnFailure = args.stopOnFailure !== false;
    const items = args.context.scenario.items;

    for (let index = 0; index < items.length; index++) {
        const item = items[index];

        const result = await runExecutionItem({
            context: args.context,
            item,
            registry: args.registry,
            executionItemDataRegistry: args.executionItemDataRegistry,
            logScope: `${args.logScope}:Item${item.itemNo}`,
            overrideItemData: args.overrideItemData,
        });

        if (stopOnFailure && result.status === "failed") {
            for (let skippedIndex = index + 1; skippedIndex < items.length; skippedIndex++) {
                addExecutionItemResult(
                    args.context,
                    createNotExecutedItemResult(items[skippedIndex])
                );
            }

            break;
        }
    }
}
