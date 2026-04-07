// src/logging/emitLog.ts

import { createLogEvent, logEvent } from "@frameworkCore/logging/log";
import { LOG_CATEGORIES } from "@frameworkCore/logging/core/logCategories";

export type LogLevel = "debug" | "info" | "warn" | "error";
export type LogCategory =
    typeof LOG_CATEGORIES[keyof typeof LOG_CATEGORIES];

export function emitLog(args: {
    scope: string;
    level: LogLevel;
    message: string;
    category?: LogCategory;
}): void {
    logEvent(
        createLogEvent({
            level: args.level,
            category: args.category ?? LOG_CATEGORIES.TECHNICAL,
            message: args.message,
            scope: args.scope,
        })
    );
}
