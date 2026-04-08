// src/frameworkCore/executionLayer/runtime/itemData/utils/matchesExecutionItemDataSource.ts

import type { ExecutionItem } from "@frameworkCore/executionLayer/contracts";
import type { ExecutionItemDataSource } from "../types";
import { normalizeResolverKey } from "./normalizeResolverKey";

export function matchesExecutionItemDataSource(args: {
    item: ExecutionItem;
    source: ExecutionItemDataSource;
}): boolean {
    const { item, source } = args;

    if (
        normalizeResolverKey(item.action) !==
        normalizeResolverKey(source.action)
    ) {
        return false;
    }

    if (source.subType) {
        if (
            normalizeResolverKey(item.subType) !==
            normalizeResolverKey(source.subType)
        ) {
            return false;
        }
    }

    return true;
}
