// src/frameworkCore/logging/publishers/filePublisher.ts

import fs from "node:fs";
import path from "node:path";
import type { LogEvent } from "@frameworkCore/logging/core/logEvent";
import { shouldWriteLogToFile } from "@frameworkCore/logging/policies/shouldWriteLogToFile";
import { buildLogFilePath } from "@frameworkCore/logging/utils/buildLogFilePath";
import { ensureLogDir } from "@frameworkCore/logging/utils/ensureLogDir";

function toJsonLine(event: LogEvent): string {
    return JSON.stringify({
        ts: event.timestamp ?? new Date().toISOString(),
        level: event.level,
        category: event.category,
        scope: event.scope ?? "",
        message: event.message,
        context: event.context ?? undefined,
        pid: process.pid,
    });
}

function appendLine(filePath: string, line: string): void {
    fs.appendFile(filePath, line, "utf8", (err) => {
        if (err) {
            // fallback to console (never throw from logger)
            console.error("[LOGGING_ERROR] Failed to write log file:", err.message);
        }
    });
}

export function publishToFile(event: LogEvent): void {
    if (!shouldWriteLogToFile(event)) {
        return;
    }

    const filePath = buildLogFilePath(event.category);
    ensureLogDir(path.dirname(filePath));

    appendLine(filePath, `${toJsonLine(event)}\n`);
}