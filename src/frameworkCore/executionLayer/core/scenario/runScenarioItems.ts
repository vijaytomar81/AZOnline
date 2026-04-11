// src/frameworkCore/executionLayer/core/scenario/runScenarioItems.ts

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
            subType: args.item.subType ?? "",
            portal: args.item.portal ?? "",
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

    // ✅ NEW: EvidenceFactory integration
    evidenceFactory?: any;
    runId?: string;
    suiteName?: string;
    mode?: "e2e" | "data";
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

            // ✅ pass through to item layer
            evidenceFactory: args.evidenceFactory,
            runId: args.runId,
            suiteName: args.suiteName,
            mode: args.mode,
        });

        if (stopOnFailure && result.status === "failed") {
            for (
                let skippedIndex = index + 1;
                skippedIndex < items.length;
                skippedIndex++
            ) {
                const skippedItem = items[skippedIndex];

                const notExecutedResult = createNotExecutedItemResult({
                    context: args.context,
                    item: skippedItem,
                    failedItem: item,
                    failedResult: result,
                });

                addExecutionItemResult(args.context, notExecutedResult);

                // ✅ ALSO send to EvidenceFactory
                try {
                    if (args.evidenceFactory) {
                        await args.evidenceFactory.writeEvidence({
                            executionId: args.runId ?? "local-run",
                            suiteName: args.suiteName ?? "default-suite",
                            artifactId:
                                String(
                                    notExecutedResult.details?.testCaseRef ??
                                    notExecutedResult.itemNo
                                ),
                            artifactName: notExecutedResult.action,
                            status: notExecutedResult.status,
                            consoleMode: args.mode,
                            outputFormats: ["json", "excel"],
                            payload: {
                                scenarioId:
                                    args.context.scenario.scenarioId,
                                scenarioName:
                                    args.context.scenario.scenarioName,

                                itemNo: notExecutedResult.itemNo,
                                action: notExecutedResult.action,
                                status: notExecutedResult.status,
                                startedAt: notExecutedResult.startedAt,
                                finishedAt: notExecutedResult.finishedAt,

                                message:
                                    notExecutedResult.message ?? "",
                                errorDetails:
                                    notExecutedResult.details
                                        ?.errorDetails ?? "",
                                blockedBy:
                                    notExecutedResult.details
                                        ?.blockedBy ?? "",
                            },
                        });
                    }
                } catch {
                    // ignore evidence failures
                }
            }

            break;
        }
    }
}