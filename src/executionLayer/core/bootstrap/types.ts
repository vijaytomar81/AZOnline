// src/executionLayer/core/bootstrap/types.ts

import type { ExecutorRegistry } from "@executionLayer/core/registry";
import type { ExecutionItemDataRegistry } from "@executionLayer/runtime/itemData";

export type ExecutionBootstrap = {
    executorRegistry: ExecutorRegistry;
    executionItemDataRegistry: ExecutionItemDataRegistry;
};

export type ExecutionBootstrapOptions = {
    registerDefaultSources?: boolean;
};
