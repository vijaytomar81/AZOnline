// src/executionLayer/runtime/itemData/utils/matchesExecutionItemDataSource.ts

import type { ExecutionItem } from "@frameworkCore/executionLayer/contracts";
import type { ExecutionItemDataSource } from "../types";
import { normalizeResolverKey } from "./normalizeResolverKey";

export function matchesExecutionItemDataSource(args: {
    item: ExecutionItem;
    journey: string;
    source: ExecutionItemDataSource;
}): boolean {
    const { item, journey, source } = args;

    if (normalizeResolverKey(item.action) !== normalizeResolverKey(source.action)) {
        return false;
    }

    if (source.journey) {
        if (normalizeResolverKey(journey) !== normalizeResolverKey(source.journey)) {
            return false;
        }
    }

    if (source.subType) {
        if (normalizeResolverKey(item.subType) !== normalizeResolverKey(source.subType)) {
            return false;
        }
    }

    return true;
}
