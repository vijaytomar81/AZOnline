// src/frameworkCore/logging/publishers/consolePublisher.ts

import type { LogEvent } from "@frameworkCore/logging/core/logEvent";
import { shouldPublishLog } from "@frameworkCore/logging/policies/shouldPublishLog";

function formatConsoleMessage(event: LogEvent): string {
    const timestamp = event.timestamp ?? new Date().toISOString();
    const level = event.level.toUpperCase();
    const category = event.category.toUpperCase();
    const scope = event.scope ? ` [${event.scope}]` : "";

    return `${timestamp} [${level}] [${category}]${scope} ${event.message}`;
}

function formatContext(context: Record<string, unknown>): string {
    return JSON.stringify(context, null, 2);
}

export function publishToConsole(event: LogEvent): void {
    if (!shouldPublishLog(event)) {
        return;
    }

    const message = formatConsoleMessage(event);

    if (event.level === "error") {
        console.error(message);
    } else if (event.level === "warn") {
        console.warn(message);
    } else {
        console.log(message);
    }

    if (event.context) {
        console.log(formatContext(event.context));
    }
}