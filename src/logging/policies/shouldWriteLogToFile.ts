// src/logging/policies/shouldWriteLogToFile.ts

import type { LogEvent } from "@logging/core/logEvent";
import { logFileConfig } from "@logging/core/logFileConfig";

export function shouldWriteLogToFile(event: LogEvent): boolean {
    if (!logFileConfig.enabled) {
        return false;
    }

    return logFileConfig.enabledCategories.has(event.category);
}