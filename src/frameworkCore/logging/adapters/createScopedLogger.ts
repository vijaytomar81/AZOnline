// src/frameworkCore/logging/adapters/createScopedLogger.ts

import { emitLog } from "@frameworkCore/logging/emitLog";
import {
    LOG_CATEGORIES,
    type LogCategory,
} from "@frameworkCore/logging/core/logCategories";
import { LOG_LEVELS } from "@frameworkCore/logging/core/logLevels";

export type ScopedLogger = {
    info(message: string): void;
    debug(message: string): void;
    warn(message: string): void;
    error(message: string): void;
    time(label: string): () => void;
    child(suffix: string): ScopedLogger;
};

export function createScopedLogger(
    scope: string,
    category: LogCategory = LOG_CATEGORIES.TECHNICAL
): ScopedLogger {
    return {
        info(message: string): void {
            emitLog({
                scope,
                level: LOG_LEVELS.INFO,
                category,
                message,
            });
        },

        debug(message: string): void {
            emitLog({
                scope,
                level: LOG_LEVELS.DEBUG,
                category,
                message,
            });
        },

        warn(message: string): void {
            emitLog({
                scope,
                level: LOG_LEVELS.WARN,
                category,
                message,
            });
        },

        error(message: string): void {
            emitLog({
                scope,
                level: LOG_LEVELS.ERROR,
                category,
                message,
            });
        },

        time(label: string): () => void {
            const startedAt = Date.now();

            emitLog({
                scope,
                level: LOG_LEVELS.DEBUG,
                category,
                message: `[timer:start] ${label}`,
            });

            return () => {
                const elapsedMs = Date.now() - startedAt;

                emitLog({
                    scope,
                    level: LOG_LEVELS.DEBUG,
                    category,
                    message: `[timer:end] ${label} (${elapsedMs}ms)`,
                });
            };
        },

        child(suffix: string): ScopedLogger {
            return createScopedLogger(`${scope}:${suffix}`, category);
        },
    };
}
