// src/frameworkCore/executionLayer/runtime/itemData/createExecutionItemDataRegistry.ts

import type { ExecutionItemDataRegistry } from "./types";

export function createExecutionItemDataRegistry(): ExecutionItemDataRegistry {
    return {
        sources: [],
        cache: new Map(),
    };
}
