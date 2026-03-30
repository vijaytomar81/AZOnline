// src/executionLayer/runtime/itemData/utils/buildExecutionItemDataCacheKey.ts

import type { ExecutionItemDataSource } from "../types";
import { normalizeResolverKey } from "./normalizeResolverKey";

export function buildExecutionItemDataCacheKey(
    source: ExecutionItemDataSource
): string {
    return [
        normalizeResolverKey(source.action),
        normalizeResolverKey(source.schemaName),
        normalizeResolverKey(source.sheetName),
    ].join("|");
}
