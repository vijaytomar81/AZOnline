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
import { buildEvidencePayload } from "@frameworkCore/executionLayer/reporting/buildEvidencePayload";
import type { ExecutionItemDataRegistry } from "@frameworkCore/executionLayer/runtime/itemData";
import {
    EVIDENCE_ENTRY_TYPE,
    EVIDENCE_OUTPUT_FORMAT,
} from "@evidenceFactory/contracts/types";
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

async function writeNotExecutedEvidence(args: {
    context: ExecutionContext;
    result: ExecutionItemResult;
    evidenceFactory?: any;
    runId?: string;
    suiteName?: string;
    workerId?: string;
    mode?: "e2e" | "data";
}): Promise<void> {
    const {
        evidenceFactory,
        runId,
        suiteName,
        workerId,
        mode,
        context,
        result,
    } = args;

    if (!evidenceFactory || !runId || !suiteName || !mode) {
        return;
    }

    await evidenceFactory.writeEvidence({
        entryType: EVIDENCE_ENTRY_TYPE.ITEM,
        executionId: runId,
        suiteName,
        workerId,
        artifactId: String(result.details?.testCaseRef ?? result.itemNo),
        artifactName: result.action,
        status: result.status,
        consoleMode: mode,
        outputFormats: [
            EVIDENCE_OUTPUT_FORMAT.JSON,
            EVIDENCE_OUTPUT_FORMAT.EXCEL,
        ],
        payload: buildEvidencePayload({
            context,
            result,
        }),
    });
}

export async function runScenarioItems(args: {
    context: ExecutionContext;
    registry: ExecutorRegistry;
    executionItemDataRegistry: ExecutionItemDataRegistry;
    logScope: string;
    overrideItemData?: Record<string, unknown>;
    stopOnFailure?: boolean;
    evidenceFactory?: any;
    runId?: string;
    suiteName?: string;
    workerId?: string;
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
            evidenceFactory: args.evidenceFactory,
            runId: args.runId,
            suiteName: args.suiteName,
            workerId: args.workerId,
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

                try {
                    await writeNotExecutedEvidence({
                        context: args.context,
                        result: notExecutedResult,
                        evidenceFactory: args.evidenceFactory,
                        runId: args.runId,
                        suiteName: args.suiteName,
                        workerId: args.workerId,
                        mode: args.mode,
                    });
                } catch {
                    // ignore evidence failures
                }
            }

            break;
        }
    }
}