// src/executionLayer/core/bootstrap/types.ts

import type { ExecutorRegistry } from "@frameworkCore/executionLayer/core/registry";
import type { ExecutionItemDataRegistry } from "@frameworkCore/executionLayer/runtime/itemData";

export type ExecutionBootstrap = {
    executorRegistry: ExecutorRegistry;
    executionItemDataRegistry: ExecutionItemDataRegistry;
};

export type ExecutionBootstrapOptions = {
    registerDefaultSources?: boolean;
};
