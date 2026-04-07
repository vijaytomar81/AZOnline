// src/executionLayer/runtime/itemData/index.ts

export type {
    ExecutionItemDataRegistry,
    ExecutionItemDataDebugCollector,
    ExecutionItemDataSource,
    ResolvedExecutionItemData,
} from "./types";

export { createExecutionItemDataRegistry } from "./createExecutionItemDataRegistry";
export { registerExecutionItemDataSource } from "./registerExecutionItemDataSource";

export { findExecutionItemCase } from "./resolve/findExecutionItemCase";
export { findExecutionItemDataSource } from "./resolve/findExecutionItemDataSource";
export { resolveExecutionItemData } from "./resolve/resolveExecutionItemData";

export { buildExecutionItemDataCacheKey } from "./utils/buildExecutionItemDataCacheKey";
export { emitResolverDebug } from "./utils/emitResolverDebug";
export { getOrLoadExecutionItemCasesFile } from "./utils/getOrLoadExecutionItemCasesFile";
export { matchesExecutionItemDataSource } from "./utils/matchesExecutionItemDataSource";
export { normalizeResolverKey } from "./utils/normalizeResolverKey";
