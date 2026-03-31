// src/executionLayer/core/registry/getExecutor.ts

import type {
    ExecutionContext,
    ExecutionItem,
} from "@executionLayer/contracts";
import { buildExecutorKey } from "./buildExecutorKey";
import type {
    ExecutionItemExecutor,
    ExecutorRegistry,
} from "./types";

export function getExecutor(
    registry: ExecutorRegistry,
    context: ExecutionContext,
    item: ExecutionItem
): ExecutionItemExecutor | undefined {
    const keys = [
        buildExecutorKey({
            action: item.action,
            journey: context.scenario.journey,
            portal: item.portal,
            subType: item.subType,
        }),
        buildExecutorKey({
            action: item.action,
            journey: context.scenario.journey,
            portal: item.portal,
        }),
        buildExecutorKey({
            action: item.action,
            journey: context.scenario.journey,
        }),
        buildExecutorKey({
            action: item.action,
            portal: item.portal,
            subType: item.subType,
        }),
        buildExecutorKey({
            action: item.action,
        }),
    ];

    return keys.map((key) => registry[key]).find(Boolean);
}
