// src/execution/runtime/stepData/utils/getOrLoadStepCasesFile.ts

import { getCasesFile } from "@data/runtime/cases/getCasesFile";
import type { CasesFile } from "@data/builder/types";
import type { DebugCollector, StepDataResolverRegistry, StepDataSource } from "../types";
import { buildStepDataCacheKey } from "./buildStepDataCacheKey";
import { emitResolverDebug } from "./emitResolverDebug";

export function getOrLoadStepCasesFile(args: {
    registry: StepDataResolverRegistry;
    source: StepDataSource;
    logScope: string;
    debugCollector?: DebugCollector;
}): CasesFile {
    const key = buildStepDataCacheKey(args.source);
    const cached = args.registry.cache.get(key);

    if (cached) {
        emitResolverDebug({
            message: `Step data cache hit -> key=${key}`,
            logScope: args.logScope,
            debugCollector: args.debugCollector,
        });

        return cached;
    }

    emitResolverDebug({
        message: `Step data cache miss -> key=${key}. Loading cases file...`,
        logScope: args.logScope,
        debugCollector: args.debugCollector,
    });

    const loaded = getCasesFile(args.source.sheetName, args.source.schemaName);
    args.registry.cache.set(key, loaded);

    return loaded;
}
