// src/frameworkCore/executionLayer/core/item/types.ts

import type {
    ExecutionContext,
    ExecutionItem,
} from "@frameworkCore/executionLayer/contracts";
import type { ExecutorRegistry } from "@frameworkCore/executionLayer/core/registry";
import type { ExecutionItemDataRegistry } from "@frameworkCore/executionLayer/runtime/itemData";
import type { EvidenceFactory } from "@evidenceFactory/factory/evidence-factory";

export type RunExecutionItemArgs = {
    context: ExecutionContext;
    item: ExecutionItem;
    registry: ExecutorRegistry;
    executionItemDataRegistry: ExecutionItemDataRegistry;
    logScope: string;
    overrideItemData?: Record<string, unknown>;
    evidenceFactory?: EvidenceFactory;
    runId?: string;
    suiteName?: string;
    workerId?: string;
    mode?: "e2e" | "data";
};
