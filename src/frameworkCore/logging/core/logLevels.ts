// src/frameworkCore/logging/core/logLevels.ts

export const LOG_LEVELS = {
    DEBUG: "debug",
    INFO: "info",
    WARN: "warn",
    ERROR: "error",
} as const;

export type LogLevel = (typeof LOG_LEVELS)[keyof typeof LOG_LEVELS];

export function getLogLevelWeight(level: LogLevel): number {
    if (level === LOG_LEVELS.DEBUG) return 10;
    if (level === LOG_LEVELS.INFO) return 20;
    if (level === LOG_LEVELS.WARN) return 30;
    return 40;
}