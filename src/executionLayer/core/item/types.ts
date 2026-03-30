// src/executionLayer/core/item/types.ts

import type {
    ExecutionContext,
    ExecutionItem,
} from "@executionLayer/contracts";
import type { ExecutorRegistry } from "@executionLayer/core/registry";
import type { ExecutionItemDataRegistry } from "@executionLayer/runtime/itemData";

export type RunExecutionItemArgs = {
    context: ExecutionContext;
    item: ExecutionItem;
    registry: ExecutorRegistry;
    executionItemDataRegistry: ExecutionItemDataRegistry;
    logScope: string;
    overrideItemData?: Record<string, unknown>;
};
