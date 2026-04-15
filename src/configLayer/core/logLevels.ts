// src/configLayer/core/logLevels.ts

export const LOG_LEVELS = {
    DEBUG: "debug",
    INFO: "info",
    WARN: "warn",
    ERROR: "error",
} as const;

export type LogLevel =
    typeof LOG_LEVELS[keyof typeof LOG_LEVELS];

export const LOG_LEVEL_LABELS = {
    DEBUG: "DEBUG",
    INFO: "INFO",
    WARN: "WARN",
    ERROR: "ERROR",
} as const;

export type LogLevelLabel =
    typeof LOG_LEVEL_LABELS[keyof typeof LOG_LEVEL_LABELS];
