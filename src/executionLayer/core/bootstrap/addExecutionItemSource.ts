// src/executionLayer/core/bootstrap/addExecutionItemSource.ts

import { LOG_CATEGORIES } from "@logging/core/logCategories";
import { LOG_LEVELS } from "@logging/core/logLevels";
import { emitLog } from "@logging/emitLog";
import {
    registerExecutionItemDataSource,
    type ExecutionItemDataSource,
} from "@executionLayer/runtime/itemData";
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
        message: `Execution item source added for action=${source.action}, sheet=${source.sheetName}`,
    });

    emitLog({
        scope: "run",
        level: LOG_LEVELS.DEBUG,
        category: LOG_CATEGORIES.FRAMEWORK,
        message: `Execution item source -> action=${source.action}, journey=${source.journey ?? ""}, subType=${source.subType ?? ""}, schema=${source.schemaName ?? ""}, sheet=${source.sheetName}`,
    });
}
