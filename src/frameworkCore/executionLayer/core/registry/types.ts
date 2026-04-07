// src/executionLayer/core/registry/types.ts

import type {
    ExecutionContext,
    ExecutionItem,
} from "@frameworkCore/executionLayer/contracts";

export type ExecutionItemExecutorArgs = {
    context: ExecutionContext;
    item: ExecutionItem;
    itemData?: Record<string, unknown>;
};

export type ExecutionItemExecutor = (
    args: ExecutionItemExecutorArgs
) => Promise<void>;

export type ExecutorRegistry = Record<string, ExecutionItemExecutor>;
