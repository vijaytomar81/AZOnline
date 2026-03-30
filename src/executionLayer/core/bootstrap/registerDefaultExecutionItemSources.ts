// src/executionLayer/core/bootstrap/registerDefaultExecutionItemSources.ts

import { registerExecutionItemDataSource } from "@executionLayer/runtime/itemData";
import type { ExecutionItemDataRegistry } from "@executionLayer/runtime/itemData";

export function registerDefaultExecutionItemSources(
    executionItemDataRegistry: ExecutionItemDataRegistry
): void {
    registerExecutionItemDataSource(executionItemDataRegistry, {
        action: "NewBusiness",
        journey: "Direct",
        sheetName: "FlowNB",
        schemaName: "direct",
    });
}
