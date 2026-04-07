// src/logging/log.ts

import type { LogEvent } from "@frameworkCore/logging/core/logEvent";
import { publishToConsole } from "@frameworkCore/logging/publishers/consolePublisher";
import { publishToFile } from "@frameworkCore/logging/publishers/filePublisher";

function normalizeEvent(event: LogEvent): LogEvent {
    return {
        ...event,
        timestamp: event.timestamp ?? new Date().toISOString(),
    };
}

export function logEvent(event: LogEvent): void {
    const normalized = normalizeEvent(event);

    publishToConsole(normalized);
    publishToFile(normalized);
}

export function createLogEvent(args: {
    level: LogEvent["level"];
    category: LogEvent["category"];
    message: string;
    scope?: LogEvent["scope"];
    context?: LogEvent["context"];
}): LogEvent {
    return {
        level: args.level,
        category: args.category,
        message: args.message,
        scope: args.scope,
        context: args.context,
    };
}