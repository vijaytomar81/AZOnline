// src/frameworkCore/executionLayer/runtime/itemData/resolve/findExecutionItemDataSource.ts

import type { ExecutionItem } from "@frameworkCore/executionLayer/contracts";
import type {
    ExecutionItemDataRegistry,
    ExecutionItemDataSource,
} from "../types";
import { matchesExecutionItemDataSource } from "../utils/matchesExecutionItemDataSource";

export function findExecutionItemDataSource(args: {
    registry: ExecutionItemDataRegistry;
    item: ExecutionItem;
}): ExecutionItemDataSource | undefined {
    return args.registry.sources.find((source) =>
        matchesExecutionItemDataSource({
            item: args.item,
            source,
        })
    );
}
