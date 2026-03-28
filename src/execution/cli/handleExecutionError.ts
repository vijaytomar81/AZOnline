// src/execution/cli/handleExecutionError.ts

import { AppError } from "@utils/errors";
import { LOG_CATEGORIES } from "@logging/core/logCategories";
import { LOG_LEVELS } from "@logging/core/logLevels";
import { emitLog } from "@logging/emitLog";

export function handleExecutionError(error: unknown): never {
    if (error instanceof AppError) {
        emitLog({
            scope: "run",
            level: LOG_LEVELS.ERROR,
            category: LOG_CATEGORIES.FRAMEWORK,
            message: `❌ [${error.code ?? "APP_ERROR"}] ${error.message}`,
        });

        if (error.stage || error.source) {
            emitLog({
                scope: "run",
                level: LOG_LEVELS.ERROR,
                category: LOG_CATEGORIES.FRAMEWORK,
                message: `Stage: ${error.stage ?? "unknown"} | Source: ${error.source ?? "unknown"}`,
            });
        }

        if (error.context) {
            emitLog({
                scope: "run",
                level: LOG_LEVELS.ERROR,
                category: LOG_CATEGORIES.FRAMEWORK,
                message: `Context: ${JSON.stringify(error.context, null, 2)}`,
            });
        }
    } else {
        emitLog({
            scope: "run",
            level: LOG_LEVELS.ERROR,
            category: LOG_CATEGORIES.FRAMEWORK,
            message: error instanceof Error ? error.message : String(error),
        });
    }

    process.exit(1);
}
