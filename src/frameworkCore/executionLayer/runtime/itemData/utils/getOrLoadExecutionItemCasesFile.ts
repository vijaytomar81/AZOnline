// src/frameworkCore/executionLayer/runtime/itemData/utils/getOrLoadExecutionItemCasesFile.ts

import { getCasesFile } from "@dataLayer/runtime/cases/getCasesFile";
import { JOURNEY_TYPES, MTA_TYPES } from "@configLayer/models/journeyContext.config";
import type { CasesFile } from "@dataLayer/builder/types";
import type { ExecutionScenario } from "@frameworkCore/executionLayer/contracts";
import type {
    ExecutionItemDataDebugCollector,
    ExecutionItemDataRegistry,
    ExecutionItemDataSource,
} from "../types";
import { buildExecutionItemDataCacheKey } from "./buildExecutionItemDataCacheKey";
import { emitResolverDebug } from "./emitResolverDebug";

function resolveJourneyContext(
    source: ExecutionItemDataSource
):
    | { type: typeof JOURNEY_TYPES.NEW_BUSINESS }
    | { type: typeof JOURNEY_TYPES.RENEWAL }
    | { type: typeof JOURNEY_TYPES.MTC }
    | { type: typeof JOURNEY_TYPES.MTA; subType: typeof MTA_TYPES.CHANGE_ADDRESS } {
    switch (source.action) {
        case "NewBusiness":
            return { type: JOURNEY_TYPES.NEW_BUSINESS };
        case "Renewal":
            return { type: JOURNEY_TYPES.RENEWAL };
        case "MTC":
            return { type: JOURNEY_TYPES.MTC };
        case "MTA":
            return {
                type: JOURNEY_TYPES.MTA,
                subType: MTA_TYPES.CHANGE_ADDRESS,
            };
        default:
            return { type: JOURNEY_TYPES.NEW_BUSINESS };
    }
}

export function getOrLoadExecutionItemCasesFile(args: {
    registry: ExecutionItemDataRegistry;
    scenario: ExecutionScenario;
    source: ExecutionItemDataSource;
    logScope: string;
    debugCollector?: ExecutionItemDataDebugCollector;
}): CasesFile {
    const journeyContext = resolveJourneyContext(args.source);

    const key = buildExecutionItemDataCacheKey({
        scenario: args.scenario,
        source: args.source,
        journeyContextType: journeyContext.type,
    });

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

    const loaded = getCasesFile({
        platform: args.scenario.platform,
        application: args.scenario.application,
        product: args.scenario.product,
        journeyContext,
    });

    args.registry.cache.set(key, loaded);

    return loaded;
}
