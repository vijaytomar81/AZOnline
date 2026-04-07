// src/logging/utils/buildLogFilePath.ts

import path from "node:path";
import type { LogCategory } from "@frameworkCore/logging/core/logCategories";
import { logFileConfig } from "@frameworkCore/logging/core/logFileConfig";

function sanitize(value: string): string {
    return value.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export function buildLogFilePath(category: LogCategory): string {
    const safeCategory = sanitize(category);
    const runDir = path.join(logFileConfig.baseDir, logFileConfig.runId);

    if (logFileConfig.splitByCategory && logFileConfig.splitByProcess) {
        return path.join(
            runDir,
            safeCategory,
            `${safeCategory}_pid${process.pid}.log`
        );
    }

    if (logFileConfig.splitByCategory) {
        return path.join(runDir, safeCategory, `${safeCategory}.log`);
    }

    if (logFileConfig.splitByProcess) {
        return path.join(runDir, `logs_pid${process.pid}.log`);
    }

    return path.join(runDir, "logs.log");
}