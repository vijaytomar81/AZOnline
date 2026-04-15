// src/frameworkCore/executionLayer/runtime/itemData/types.ts

import type { CasesFile } from "@dataLayer/builder/types";

export type ExecutionItemDataSource = {
    action: string;
    subType?: string;
};

export type ResolvedExecutionItemData = {
    testCaseRef: string;
    payload: Record<string, unknown>;
    source: ExecutionItemDataSource;
};

export type ExecutionItemDataRegistry = {
    sources: ExecutionItemDataSource[];
    cache: Map<string, CasesFile>;
};

export type ExecutionItemDataDebugCollector = {
    push(message: string): void;
};
