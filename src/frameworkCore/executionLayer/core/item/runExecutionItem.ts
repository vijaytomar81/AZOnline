// src/executionLayer/core/item/runExecutionItem.ts

import { nowIso } from "@utils/time";
import { LOG_CATEGORIES } from "@frameworkCore/logging/core/logCategories";
import { LOG_LEVELS } from "@frameworkCore/logging/core/logLevels";
import { emitLog } from "@frameworkCore/logging/emitLog";
import { addExecutionItemResult } from "@frameworkCore/executionLayer/core/context";
import type { ExecutionItemResult } from "@frameworkCore/executionLayer/contracts";
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

    try {
        await executorLookup.executor({
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
            outputs: {},
        });

        addExecutionItemResult(args.context, result);
        return result;
    }
}
