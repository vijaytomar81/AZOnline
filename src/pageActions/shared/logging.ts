// src/pageActions/shared/logging.ts

import { emitLog } from "@logging/emitLog";
import { LOG_CATEGORIES } from "@logging/core/logCategories";
import { LOG_LEVELS } from "@logging/core/logLevels";

export function logPageActionInfo(args: {
    scope: string;
    message: string;
    details?: Record<string, unknown>;
}): void {
    const suffix = args.details
        ? ` | details=${JSON.stringify(args.details)}`
        : "";

    emitLog({
        scope: args.scope,
        level: LOG_LEVELS.INFO,
        category: LOG_CATEGORIES.FRAMEWORK,
        message: `${args.message}${suffix}`,
    });
}
