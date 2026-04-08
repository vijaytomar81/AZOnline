// src/frameworkCore/executionLayer/core/item/getExecutionItemExecutor.ts

import { getExecutor } from "@frameworkCore/executionLayer/core/registry";
import type { ExecutionContext, ExecutionItem } from "@frameworkCore/executionLayer/contracts";
import type { ExecutorRegistry } from "@frameworkCore/executionLayer/core/registry";

export function getExecutionItemExecutor(args: {
    registry: ExecutorRegistry;
    context: ExecutionContext;
    item: ExecutionItem;
}) {
    return getExecutor({
        registry: args.registry,
        context: args.context,
        item: args.item,
    });
}
