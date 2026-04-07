// src/executionLayer/core/scenario/runScenarioItems.ts

import { nowIso } from "@utils/time";
import type {
    ExecutionContext,
    ExecutionItem,
    ExecutionItemResult,
} from "@frameworkCore/executionLayer/contracts";
import type { ExecutorRegistry } from "@frameworkCore/executionLayer/core/registry";
import { addExecutionItemResult } from "@frameworkCore/executionLayer/core/context";
import { createExecutionItemResult } from "@frameworkCore/executionLayer/core/result";
import type { ExecutionItemDataRegistry } from "@frameworkCore/executionLayer/runtime/itemData";
import { runExecutionItem } from "@frameworkCore/executionLayer/core/item";

function buildNotExecutedReason(args: {
    context: ExecutionContext;
    failedItem: ExecutionItem;
    failedResult: ExecutionItemResult;
}): string {
    const scenarioId = args.context.scenario.scenarioId;
    const failedMessage =
        args.failedResult.message?.trim() ||
        "Previous item failed.";

    return [
        `Not executed because one of the previous item failed.`,
        `[ScenarioId="${scenarioId}"`,
        ` | FailedItemNo=${args.failedItem.itemNo}`,
        ` | FailedAction="${args.failedItem.action}"`,
        ` | FailedTestCaseRef="${args.failedItem.testCaseRef}"]`,
    ].join(" ");
}

function createNotExecutedItemResult(args: {
    context: ExecutionContext;
    item: ExecutionItem;
    failedItem: ExecutionItem;
    failedResult: ExecutionItemResult;
}): ExecutionItemResult {
    const timestamp = nowIso();
    const errorDetails = buildNotExecutedReason({
        context: args.context,
        failedItem: args.failedItem,
        failedResult: args.failedResult,
    });

    return createExecutionItemResult({
        itemNo: args.item.itemNo,
        action: args.item.action,
        status: "not_executed",
        startedAt: timestamp,
        finishedAt: timestamp,
        message: errorDetails,
        details: {
            testCaseRef: args.item.testCaseRef,
            outputs: {},
            errorDetails,
            pageScans: [],
            blockedBy: {
                scenarioId: args.context.scenario.scenarioId,
                scenarioName: args.context.scenario.scenarioName,
                itemNo: args.failedItem.itemNo,
                action: args.failedItem.action,
                testCaseRef: args.failedItem.testCaseRef,
                reason: args.failedResult.message ?? "",
            },
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
            for (
                let skippedIndex = index + 1;
                skippedIndex < items.length;
                skippedIndex++
            ) {
                addExecutionItemResult(
                    args.context,
                    createNotExecutedItemResult({
                        context: args.context,
                        item: items[skippedIndex],
                        failedItem: item,
                        failedResult: result,
                    })
                );
            }

            break;
        }
    }
}
