// src/frameworkCore/executionLayer/core/registry/getExecutor.ts

import { AppError } from "@utils/errors";
import type {
    ExecutionContext,
    ExecutionItem,
} from "@frameworkCore/executionLayer/contracts";
import type { ExecutorRegistry } from "./types";
import { buildExecutorKey } from "./buildExecutorKey";

export function getExecutor(args: {
    registry: ExecutorRegistry;
    context: ExecutionContext;
    item: ExecutionItem;
}) {
    const exactKey = buildExecutorKey({
        action: args.item.action,
        portal: args.item.portal,
        subType: args.item.subType,
    });

    const byPortalKey = buildExecutorKey({
        action: args.item.action,
        portal: args.item.portal,
    });

    const byActionKey = buildExecutorKey({
        action: args.item.action,
    });

    const executor =
        args.registry[exactKey] ??
        args.registry[byPortalKey] ??
        args.registry[byActionKey];

    if (executor) {
        return executor;
    }

    throw new AppError({
        code: "EXECUTOR_NOT_FOUND",
        stage: "execution",
        source: "getExecutor",
        message:
            `No executor registered for action="${args.item.action}", ` +
            `portal="${args.item.portal ?? ""}", subType="${args.item.subType ?? ""}".`,
        context: {
            action: args.item.action,
            portal: args.item.portal ?? "",
            subType: args.item.subType ?? "",
            triedKeys: [exactKey, byPortalKey, byActionKey],
        },
    });
}
