// src/frameworkCore/executionLayer/core/item/runExecutionItem.ts

import { nowIso } from "@utils/time";
import { LOG_CATEGORIES } from "@frameworkCore/logging/core/logCategories";
import { LOG_LEVELS } from "@frameworkCore/logging/core/logLevels";
import { emitLog } from "@frameworkCore/logging/emitLog";
import { addExecutionItemResult } from "@frameworkCore/executionLayer/core/context";
import type { ExecutionItemResult } from "@frameworkCore/executionLayer/contracts";
import { buildEvidencePayload } from "@frameworkCore/executionLayer/reporting/buildEvidencePayload";
import {
    EVIDENCE_ENTRY_TYPE,
    EVIDENCE_OUTPUT_FORMAT,
} from "@evidenceFactory/contracts/types";
import { buildExecutionItemFailureResult } from "./buildExecutionItemFailureResult";
import { createExecutionItemDebugCollector } from "./createExecutionItemDebugCollector";
import { createExecutionItemSuccessResult } from "./createExecutionItemSuccessResult";
import {
    cloneExecutionOutputs,
    diffExecutionOutputs,
} from "./diffExecutionOutputs";
import { getExecutionItemExecutor } from "./getExecutionItemExecutor";
import { resolveExecutionItemData } from "./resolveExecutionItemData";
import type { RunExecutionItemArgs } from "./types";

async function executeItem(args: {
    runArgs: RunExecutionItemArgs;
    startedAt: string;
}): Promise<ExecutionItemResult> {
    const debug = createExecutionItemDebugCollector();

    emitLog({
        scope: args.runArgs.logScope,
        level: LOG_LEVELS.DEBUG,
        category: LOG_CATEGORIES.TECHNICAL,
        message: `Execution item started -> action=${args.runArgs.item.action}, testCaseRef=${args.runArgs.item.testCaseRef}`,
    });

    const outputsBefore = cloneExecutionOutputs(args.runArgs.context.outputs);

    let executor;
    try {
        executor = getExecutionItemExecutor({
            registry: args.runArgs.registry,
            context: args.runArgs.context,
            item: args.runArgs.item,
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);

        return buildExecutionItemFailureResult({
            item: args.runArgs.item,
            startedAt: args.startedAt,
            message,
            outputs: {},
        });
    }

    const resolved = resolveExecutionItemData({
        context: args.runArgs.context,
        item: args.runArgs.item,
        executionItemDataRegistry: args.runArgs.executionItemDataRegistry,
        logScope: args.runArgs.logScope,
        debugCollector: debug,
        overrideItemData: args.runArgs.overrideItemData,
    });

    try {
        await executor({
            context: args.runArgs.context,
            item: args.runArgs.item,
            itemData: resolved.payload,
        });

        const outputs = diffExecutionOutputs({
            before: outputsBefore,
            after: args.runArgs.context.outputs,
        });

        return createExecutionItemSuccessResult({
            item: args.runArgs.item,
            startedAt: args.startedAt,
            resolved,
            outputs,
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);

        const outputs = diffExecutionOutputs({
            before: outputsBefore,
            after: args.runArgs.context.outputs,
        });

        return buildExecutionItemFailureResult({
            item: args.runArgs.item,
            startedAt: args.startedAt,
            message,
            outputs,
        });
    }
}

async function writeItemEvidence(args: {
    runArgs: RunExecutionItemArgs;
    result: ExecutionItemResult;
}): Promise<void> {
    const {
        evidenceFactory,
        runId,
        suiteName,
        mode,
        workerId,
        context,
    } = args.runArgs;

    if (!evidenceFactory || !runId || !suiteName || !mode) {
        return;
    }

    const artifactId = String(
        args.result.details?.testCaseRef ?? args.result.itemNo
    );

    const artifactName = [
        args.result.action,
        args.result.details?.subType,
        args.result.details?.portal,
    ]
        .filter(Boolean)
        .join("-");

    await evidenceFactory.writeEvidence({
        entryType: EVIDENCE_ENTRY_TYPE.ITEM,
        executionId: runId,
        suiteName,
        workerId,
        artifactId,
        artifactName: artifactName || args.result.action,
        status: args.result.status,
        consoleMode: mode,
        outputFormats: [
            EVIDENCE_OUTPUT_FORMAT.JSON,
            EVIDENCE_OUTPUT_FORMAT.EXCEL,
        ],
        payload: buildEvidencePayload({
            context,
            result: args.result,
        }),
    });
}

export async function runExecutionItem(
    args: RunExecutionItemArgs
): Promise<ExecutionItemResult> {
    const startedAt = nowIso();

    try {
        const result = await executeItem({
            runArgs: args,
            startedAt,
        });

        addExecutionItemResult(args.context, result);

        try {
            await writeItemEvidence({
                runArgs: args,
                result,
            });
        } catch (error) {
            emitLog({
                scope: args.logScope,
                level: LOG_LEVELS.WARN,
                category: LOG_CATEGORIES.FRAMEWORK,
                message: `EvidenceFactory write failed: ${error instanceof Error ? error.message : String(error)
                    }`,
            });
        }

        return result;
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);

        const result = buildExecutionItemFailureResult({
            item: args.item,
            startedAt,
            message,
            outputs: {},
        });

        addExecutionItemResult(args.context, result);

        try {
            await writeItemEvidence({
                runArgs: args,
                result,
            });
        } catch {
            // ignore evidence write failure
        }

        return result;
    }
}