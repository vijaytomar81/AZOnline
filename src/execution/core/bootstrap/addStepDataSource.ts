// src/execution/core/bootstrap/addStepDataSource.ts

import { LOG_CATEGORIES } from "@logging/core/logCategories";
import { LOG_LEVELS } from "@logging/core/logLevels";
import { emitLog } from "@logging/emitLog";
import {
    registerStepDataSource,
    type StepDataSource,
} from "@execution/runtime/resolveStepData";
import type { ExecutionBootstrap } from "./createExecutionBootstrap";

export function addStepDataSource(
    bootstrap: ExecutionBootstrap,
    source: StepDataSource
): void {
    registerStepDataSource(bootstrap.stepDataRegistry, source);

    emitLog({
        scope: "run",
        level: LOG_LEVELS.DEBUG,
        category: LOG_CATEGORIES.FRAMEWORK,
        message: `Step data source added for action=${source.action}, sheet=${source.sheetName}`,
    });

    emitLog({
        scope: "run",
        level: LOG_LEVELS.DEBUG,
        category: LOG_CATEGORIES.FRAMEWORK,
        message: `Step data source -> action=${source.action}, journey=${source.journey ?? ""}, subType=${source.subType ?? ""}, schema=${source.schemaName ?? ""}, sheet=${source.sheetName}`,
    });
}
