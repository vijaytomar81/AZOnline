// src/frameworkCore/executionLayer/runtime/itemData/utils/buildExecutionItemDataCacheKey.ts

import type { ExecutionScenario } from "@frameworkCore/executionLayer/contracts";
import type { ExecutionItemDataSource } from "../types";
import { normalizeResolverKey } from "./normalizeResolverKey";

export function buildExecutionItemDataCacheKey(args: {
    scenario: ExecutionScenario;
    source: ExecutionItemDataSource;
    journeyContextType: string;
}): string {
    return [
        normalizeResolverKey(args.scenario.platform),
        normalizeResolverKey(args.scenario.application),
        normalizeResolverKey(args.scenario.product),
        normalizeResolverKey(args.journeyContextType),
        normalizeResolverKey(args.source.action),
        normalizeResolverKey(args.source.subType),
    ].join("|");
}
