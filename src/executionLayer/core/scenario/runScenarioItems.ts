// src/executionLayer/core/scenario/runScenarioItems.ts

import type { ExecutionContext } from "@executionLayer/contracts";
import type { ExecutorRegistry } from "@executionLayer/core/registry";
import type { ExecutionItemDataRegistry } from "@executionLayer/runtime/itemData";
import { runExecutionItem } from "@executionLayer/core/item";

export async function runScenarioItems(args: {
    context: ExecutionContext;
    registry: ExecutorRegistry;
    executionItemDataRegistry: ExecutionItemDataRegistry;
    logScope: string;
    overrideItemData?: Record<string, unknown>;
    stopOnFailure?: boolean;
}): Promise<void> {
    const stopOnFailure = args.stopOnFailure !== false;

    for (const item of args.context.scenario.items) {
        const result = await runExecutionItem({
            context: args.context,
            item,
            registry: args.registry,
            executionItemDataRegistry: args.executionItemDataRegistry,
            logScope: `${args.logScope}:Item${item.itemNo}`,
            overrideItemData: args.overrideItemData,
        });

        if (stopOnFailure && result.status === "failed") {
            break;
        }
    }
}
