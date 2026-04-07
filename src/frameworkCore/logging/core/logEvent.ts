// src/logging/core/logEvent.ts

import type { LogCategory } from "./logCategories";
import type { LogLevel } from "./logLevels";
import type { LogScope } from "./logScopes";

export type LogContext = Record<string, unknown>;

export type LogEvent = {
    level: LogLevel;
    category: LogCategory;
    message: string;
    timestamp?: string;
    scope?: LogScope | string;
    context?: LogContext;
};