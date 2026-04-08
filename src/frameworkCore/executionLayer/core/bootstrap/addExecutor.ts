// src/frameworkCore/executionLayer/core/bootstrap/addExecutor.ts

import { LOG_CATEGORIES } from "@frameworkCore/logging/core/logCategories";
import { LOG_LEVELS } from "@frameworkCore/logging/core/logLevels";
import { emitLog } from "@frameworkCore/logging/emitLog";
import {
    registerExecutor,
    type ExecutionItemExecutor,
} from "@frameworkCore/executionLayer/core/registry";
import type { ExecutionBootstrap } from "./types";

export function addExecutor(args: {
    bootstrap: ExecutionBootstrap;
    action: string;
    portal?: string;
    subType?: string;
    executor: ExecutionItemExecutor;
}): void {
    registerExecutor(args.bootstrap.executorRegistry, {
        action: args.action,
        portal: args.portal,
        subType: args.subType,
        executor: args.executor,
    });

    const route = [
        `action=${args.action}`,
        args.portal ? `portal=${args.portal}` : "",
        args.subType ? `subType=${args.subType}` : "",
    ]
        .filter(Boolean)
        .join(", ");

    emitLog({
        scope: "run",
        level: LOG_LEVELS.DEBUG,
        category: LOG_CATEGORIES.FRAMEWORK,
        message: `Execution item executor added for ${route}`,
    });

    emitLog({
        scope: "run",
        level: LOG_LEVELS.DEBUG,
        category: LOG_CATEGORIES.FRAMEWORK,
        message: `Executor registry size=${Object.keys(args.bootstrap.executorRegistry).length}`,
    });
}
