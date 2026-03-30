// src/executionLayer/core/item/runExecutionItem.ts

import { nowIso } from "@utils/time";
import { LOG_CATEGORIES } from "@logging/core/logCategories";
import { LOG_LEVELS } from "@logging/core/logLevels";
import { emitLog } from "@logging/emitLog";
import { addExecutionItemResult } from "@executionLayer/core/context";
import type { ExecutionItemResult } from "@executionLayer/contracts";
import { buildExecutionItemFailureResult } from "./buildExecutionItemFailureResult";
import { createExecutionItemDebugCollector } from "./createExecutionItemDebugCollector";
import { createExecutionItemSuccessResult } from "./createExecutionItemSuccessResult";
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

    const executorLookup = getExecutionItemExecutor({
        runArgs: args.runArgs,
        startedAt: args.startedAt,
        debugLines: debug.all(),
    });

    if (!executorLookup.executorFound) {
        return executorLookup.result;
    }

    const resolved = resolveExecutionItemData({
        context: args.runArgs.context,
        item: args.runArgs.item,
        executionItemDataRegistry: args.runArgs.executionItemDataRegistry,
        logScope: args.runArgs.logScope,
        debugCollector: debug,
        overrideItemData: args.runArgs.overrideItemData,
    });

    await executorLookup.executor({
        context: args.runArgs.context,
        item: args.runArgs.item,
        itemData: resolved.payload,
    });

    return createExecutionItemSuccessResult({
        item: args.runArgs.item,
        startedAt: args.startedAt,
        resolved,
        debugLines: debug.all(),
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
        return result;
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);

        const result = buildExecutionItemFailureResult({
            item: args.item,
            startedAt,
            message,
            debugLines: [],
        });

        addExecutionItemResult(args.context, result);
        return result;
    }
}
