// src/frameworkCore/executionLayer/core/item/types.ts

import type {
    ExecutionContext,
    ExecutionItem,
} from "@frameworkCore/executionLayer/contracts";
import type { ExecutorRegistry } from "@frameworkCore/executionLayer/core/registry";
import type { ExecutionItemDataRegistry } from "@frameworkCore/executionLayer/runtime/itemData";

export type RunExecutionItemArgs = {
    context: ExecutionContext;
    item: ExecutionItem;
    registry: ExecutorRegistry;
    executionItemDataRegistry: ExecutionItemDataRegistry;
    logScope: string;
    overrideItemData?: Record<string, unknown>;

    // ✅ ADD THESE
    evidenceFactory?: any;
    runId?: string;
    suiteName?: string;
    mode?: "e2e" | "data";
};
