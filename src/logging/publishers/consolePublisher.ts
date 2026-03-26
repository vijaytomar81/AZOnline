// src/logging/publishers/consolePublisher.ts

import type { LogEvent } from "@logging/core/logEvent";
import { shouldPublishLog } from "@logging/policies/shouldPublishLog";

function formatConsoleMessage(event: LogEvent): string {
    const level = event.level.toUpperCase();
    const category = event.category;
    const scope = event.scope ? ` [${event.scope}]` : "";

    return `[${level}] [${category}]${scope} ${event.message}`;
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
        console.log("Context:", JSON.stringify(event.context, null, 2));
    }
}