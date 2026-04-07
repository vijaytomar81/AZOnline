// src/executionLayer/runtime/itemData/registerExecutionItemDataSource.ts

import type {
    ExecutionItemDataRegistry,
    ExecutionItemDataSource,
} from "./types";

export function registerExecutionItemDataSource(
    registry: ExecutionItemDataRegistry,
    source: ExecutionItemDataSource
): void {
    registry.sources.push(source);
}
