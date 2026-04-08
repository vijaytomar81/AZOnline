// src/frameworkCore/logging/policies/shouldWriteLogToFile.ts

import type { LogEvent } from "@frameworkCore/logging/core/logEvent";
import { logFileConfig } from "@frameworkCore/logging/core/logFileConfig";

export function shouldWriteLogToFile(event: LogEvent): boolean {
    if (!logFileConfig.enabled) {
        return false;
    }

    return logFileConfig.enabledCategories.has(event.category);
}