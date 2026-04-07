// src/executionLayer/core/item/getExecutionItemExecutor.ts

import type { ExecutionItemResult } from "@frameworkCore/executionLayer/contracts";
import { getExecutor } from "@frameworkCore/executionLayer/core/registry";
import { buildExecutionItemFailureResult } from "./buildExecutionItemFailureResult";
import type { RunExecutionItemArgs } from "./types";

export function getExecutionItemExecutor(args: {
    runArgs: RunExecutionItemArgs;
    startedAt: string;
    debugLines: string[];
}): {
    executorFound: true;
    executor: NonNullable<ReturnType<typeof getExecutor>>;
} | {
    executorFound: false;
    result: ExecutionItemResult;
} {
    const executor = getExecutor(
        args.runArgs.registry,
        args.runArgs.context,
        args.runArgs.item
    );

    if (!executor) {
        return {
            executorFound: false,
            result: buildExecutionItemFailureResult({
                item: args.runArgs.item,
                startedAt: args.startedAt,
                message: `No executor registered for execution item action="${args.runArgs.item.action}"`,
                outputs: {},
            }),
        };
    }

    return {
        executorFound: true,
        executor,
    };
}
