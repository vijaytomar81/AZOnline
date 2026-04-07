// src/executionLayer/runtime/itemData/utils/getOrLoadExecutionItemCasesFile.ts

import { getCasesFile } from "@dataLayer/runtime/cases/getCasesFile";
import type { CasesFile } from "@dataLayer/builder/types";
import type {
    ExecutionItemDataDebugCollector,
    ExecutionItemDataRegistry,
    ExecutionItemDataSource,
} from "../types";
import { buildExecutionItemDataCacheKey } from "./buildExecutionItemDataCacheKey";
import { emitResolverDebug } from "./emitResolverDebug";

export function getOrLoadExecutionItemCasesFile(args: {
    registry: ExecutionItemDataRegistry;
    source: ExecutionItemDataSource;
    logScope: string;
    debugCollector?: ExecutionItemDataDebugCollector;
}): CasesFile {
    const key = buildExecutionItemDataCacheKey(args.source);
    const cached = args.registry.cache.get(key);

    if (cached) {
        emitResolverDebug({
            message: `Execution item data cache hit -> key=${key}`,
            logScope: args.logScope,
            debugCollector: args.debugCollector,
        });

        return cached;
    }

    emitResolverDebug({
        message: `Execution item data cache miss -> key=${key}. Loading cases file...`,
        logScope: args.logScope,
        debugCollector: args.debugCollector,
    });

    const loaded = getCasesFile(args.source.sheetName, args.source.schemaName);
    args.registry.cache.set(key, loaded);

    return loaded;
}
