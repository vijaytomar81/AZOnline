// src/logging/core/logScopes.ts

export const LOG_SCOPES = {
    APP: "app",
    RUN: "run",
    CASE: "case",
    SCENARIO: "scenario",
    STEP: "step",
    PLUGIN: "plugin",
    REQUEST: "request",
    FILE: "file",
    PAGE: "page",
} as const;

export type LogScope =
    (typeof LOG_SCOPES)[keyof typeof LOG_SCOPES];