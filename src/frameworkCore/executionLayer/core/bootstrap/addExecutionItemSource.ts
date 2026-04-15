// src/frameworkCore/executionLayer/core/bootstrap/addExecutionItemSource.ts

import { LOG_CATEGORIES } from "@frameworkCore/logging/core/logCategories";
import { LOG_LEVELS } from "@frameworkCore/logging/core/logLevels";
import { emitLog } from "@frameworkCore/logging/emitLog";
import {
    registerExecutionItemDataSource,
    type ExecutionItemDataSource,
} from "@frameworkCore/executionLayer/runtime/itemData";
import type { ExecutionBootstrap } from "./types";

export function addExecutionItemSource(
    bootstrap: ExecutionBootstrap,
    source: ExecutionItemDataSource
): void {
    registerExecutionItemDataSource(
        bootstrap.executionItemDataRegistry,
        source
    );

    emitLog({
        scope: "run",
        level: LOG_LEVELS.DEBUG,
        category: LOG_CATEGORIES.FRAMEWORK,
        message: `Execution item source added for action=${source.action}, subType=${source.subType ?? ""}`,
    });
}
