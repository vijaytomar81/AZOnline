// src/frameworkCore/executionLayer/runtime/itemData/utils/getOrLoadExecutionItemCasesFile.ts

import { AppError } from "@utils/errors";
import { getCasesFile } from "@dataLayer/runtime/cases/getCasesFile";
import {
    JOURNEY_TYPES,
    MTA_TYPES,
} from "@configLayer/models/journeyContext.config";
import type { CasesFile } from "@dataLayer/builder/types";
import type {
    ExecutionItem,
    ExecutionScenario,
} from "@frameworkCore/executionLayer/contracts";
import type {
    ExecutionItemDataDebugCollector,
    ExecutionItemDataRegistry,
    ExecutionItemDataSource,
} from "../types";
import { buildExecutionItemDataCacheKey } from "./buildExecutionItemDataCacheKey";
import { emitResolverDebug } from "./emitResolverDebug";

function buildActionLabel(item: ExecutionItem): string {
    if (item.action === JOURNEY_TYPES.MTA && item.subType) {
        return `action="${item.action}", subType="${item.subType}"`;
    }

    return `action="${item.action}"`;
}

function resolveMtaSubType(raw?: string) {
    const allowed = Object.values(MTA_TYPES);
    const resolved = allowed.find(
        (item) => item.toLowerCase() === String(raw ?? "").trim().toLowerCase()
    );

    if (resolved) {
        return resolved;
    }

    throw new AppError({
        code: "EXECUTION_ITEM_MTA_SUBTYPE_INVALID",
        stage: "resolve-execution-item-data",
        source: "getOrLoadExecutionItemCasesFile",
        message:
            `MTA execution item requires valid subType. ` +
            `Allowed: ${allowed.join(", ")}.`,
        context: {
            subType: raw ?? "",
        },
    });
}

function resolveJourneyContext(args: {
    source: ExecutionItemDataSource;
    item: ExecutionItem;
}):
    | { type: typeof JOURNEY_TYPES.NEW_BUSINESS }
    | { type: typeof JOURNEY_TYPES.RENEWAL }
    | { type: typeof JOURNEY_TYPES.MTC }
    | { type: typeof JOURNEY_TYPES.MTA; subType: typeof MTA_TYPES[keyof typeof MTA_TYPES] } {
    switch (args.source.action) {
        case JOURNEY_TYPES.NEW_BUSINESS:
            return { type: JOURNEY_TYPES.NEW_BUSINESS };
        case JOURNEY_TYPES.RENEWAL:
            return { type: JOURNEY_TYPES.RENEWAL };
        case JOURNEY_TYPES.MTC:
            return { type: JOURNEY_TYPES.MTC };
        case JOURNEY_TYPES.MTA:
            return {
                type: JOURNEY_TYPES.MTA,
                subType: resolveMtaSubType(args.item.subType),
            };
        default:
            return { type: JOURNEY_TYPES.NEW_BUSINESS };
    }
}

function loadCasesFile(args: {
    scenario: ExecutionScenario;
    item: ExecutionItem;
    journeyContext:
        | { type: typeof JOURNEY_TYPES.NEW_BUSINESS }
        | { type: typeof JOURNEY_TYPES.RENEWAL }
        | { type: typeof JOURNEY_TYPES.MTC }
        | { type: typeof JOURNEY_TYPES.MTA; subType: typeof MTA_TYPES[keyof typeof MTA_TYPES] };
}): CasesFile {
    try {
        return getCasesFile({
            platform: args.scenario.platform,
            application: args.scenario.application,
            product: args.scenario.product,
            journeyContext: args.journeyContext,
        });
    } catch (error) {
        throw new AppError({
            code: "EXECUTION_ITEM_TEST_DATA_JSON_LOAD_FAILED",
            stage: "resolve-execution-item-data",
            source: "getOrLoadExecutionItemCasesFile",
            message: `Test Data JSON file could not be loaded for ${buildActionLabel(args.item)}.`,
            context: {
                scenarioId: args.scenario.scenarioId,
                platform: args.scenario.platform,
                application: args.scenario.application,
                product: args.scenario.product,
                action: args.item.action,
                subType: args.item.subType ?? "",
                testCaseRef: args.item.testCaseRef,
                cause: error instanceof Error ? error.message : String(error),
            },
        });
    }
}

export function getOrLoadExecutionItemCasesFile(args: {
    registry: ExecutionItemDataRegistry;
    scenario: ExecutionScenario;
    source: ExecutionItemDataSource;
    item: ExecutionItem;
    logScope: string;
    debugCollector?: ExecutionItemDataDebugCollector;
}): CasesFile {
    const journeyContext = resolveJourneyContext({
        source: args.source,
        item: args.item,
    });

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

    const loaded = loadCasesFile({
        scenario: args.scenario,
        item: args.item,
        journeyContext,
    });

    args.registry.cache.set(key, loaded);

    return loaded;
}
