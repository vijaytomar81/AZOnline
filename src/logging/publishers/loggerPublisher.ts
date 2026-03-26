// src/logging/publishers/loggerPublisher.ts

import type { Logger } from "@utils/logger";
import type { LogEvent } from "@logging/core/logEvent";
import { shouldPublishLog } from "@logging/policies/shouldPublishLog";

function formatLoggerMessage(event: LogEvent): string {
    const scope = event.scope ? ` [${event.scope}]` : "";
    return `[${event.category}]${scope} ${event.message}`;
}

export function publishToLogger(log: Logger, event: LogEvent): void {
    if (!shouldPublishLog(event)) {
        return;
    }

    const message = formatLoggerMessage(event);

    if (event.level === "error") {
        log.error(message);
        return;
    }

    if (event.level === "warn") {
        log.warn?.(message);
        return;
    }

    if (event.level === "debug") {
        log.debug?.(message);
        return;
    }

    log.info(message);
}