// src/logging/policies/shouldPublishLog.ts

import type { LogEvent } from "@frameworkCore/logging/core/logEvent";
import { LOG_LEVELS } from "@frameworkCore/logging/core/logLevels";
import { logConfig } from "@frameworkCore/logging/core/logConfig";

export function shouldPublishLog(event: LogEvent): boolean {
    if (!logConfig.enabledCategories.has(event.category)) {
        return false;
    }

    if (event.level === LOG_LEVELS.ERROR) {
        return true;
    }

    if (event.level === LOG_LEVELS.WARN) {
        return true;
    }

    if (event.level === LOG_LEVELS.INFO) {
        return true;
    }

    return logConfig.verbose;
}