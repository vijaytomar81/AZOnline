// src/executionLayer/runtime/defaults/registerDefaultExecutors.ts

import { LOG_CATEGORIES } from "@logging/core/logCategories";
import { LOG_LEVELS } from "@logging/core/logLevels";
import { emitLog } from "@logging/emitLog";
import type { ExecutionBootstrap } from "@executionLayer/core/bootstrap";

export function registerDefaultExecutors(
    _bootstrap: ExecutionBootstrap
): void {
    emitLog({
        scope: "execution:register-defaults",
        level: LOG_LEVELS.DEBUG,
        category: LOG_CATEGORIES.FRAMEWORK,
        message: "No default execution item executors registered yet.",
    });
}
