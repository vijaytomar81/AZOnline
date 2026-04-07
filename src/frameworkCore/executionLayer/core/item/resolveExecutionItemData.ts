// src/executionLayer/core/item/resolveExecutionItemData.ts

import type {
    ExecutionContext,
    ExecutionItem,
    ResolvedExecutionItemData,
} from "@frameworkCore/executionLayer/contracts";
import { resolveExecutionItemData as resolveExecutionItemDataFromRegistry } from "@frameworkCore/executionLayer/runtime/itemData";
import { buildOverrideResolved } from "./buildOverrideResolved";

export function resolveExecutionItemData(args: {
    context: ExecutionContext;
    item: ExecutionItem;
    executionItemDataRegistry: Parameters<
        typeof resolveExecutionItemDataFromRegistry
    >[0]["registry"];
    logScope: string;
    debugCollector?: { push(message: string): void };
    overrideItemData?: Record<string, unknown>;
}): ResolvedExecutionItemData {
    if (args.overrideItemData) {
        args.debugCollector?.push(
            `Using override execution item data -> action=${args.item.action}, testCaseRef=${args.item.testCaseRef}`
        );
        args.debugCollector?.push(
            `Resolved source -> sheet=data-mode, action=${args.item.action}`
        );

        return buildOverrideResolved(args.item, args.overrideItemData);
    }

    return resolveExecutionItemDataFromRegistry({
        registry: args.executionItemDataRegistry,
        journey: args.context.scenario.journey,
        item: args.item,
        logScope: args.logScope,
        debugCollector: args.debugCollector,
    });
}
