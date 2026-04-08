// src/frameworkCore/executionLayer/core/bootstrap/registerDefaultExecutionItemSources.ts

import { registerExecutionItemDataSource } from "@frameworkCore/executionLayer/runtime/itemData";
import type { ExecutionItemDataRegistry } from "@frameworkCore/executionLayer/runtime/itemData";

export function registerDefaultExecutionItemSources(
    registry: ExecutionItemDataRegistry
): void {
    registerExecutionItemDataSource(registry, {
        action: "NewBusiness",
    });

    registerExecutionItemDataSource(registry, {
        action: "MTA",
    });

    registerExecutionItemDataSource(registry, {
        action: "Renewal",
    });

    registerExecutionItemDataSource(registry, {
        action: "MTC",
    });
}
