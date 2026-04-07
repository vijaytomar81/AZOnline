// src/executionLayer/runtime/itemData/types.ts

import type { CasesFile } from "@dataLayer/builder/types";
import type {
    ExecutionItemDataSource,
    ResolvedExecutionItemData,
} from "@frameworkCore/executionLayer/contracts";

export type ExecutionItemDataRegistry = {
    sources: ExecutionItemDataSource[];
    cache: Map<string, CasesFile>;
};

export type ExecutionItemDataDebugCollector = {
    push(message: string): void;
};

export type {
    ExecutionItemDataSource,
    ResolvedExecutionItemData,
};
