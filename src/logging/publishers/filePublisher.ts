// src/logging/publishers/filePublisher.ts

import fs from "node:fs";
import path from "node:path";
import type { LogEvent } from "@logging/core/logEvent";
import { shouldWriteLogToFile } from "@logging/policies/shouldWriteLogToFile";
import { buildLogFilePath } from "@logging/utils/buildLogFilePath";
import { ensureLogDir } from "@logging/utils/ensureLogDir";

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

export function publishToFile(event: LogEvent): void {
    if (!shouldWriteLogToFile(event)) {
        return;
    }

    const filePath = buildLogFilePath(event.category);
    ensureLogDir(path.dirname(filePath));

    fs.appendFileSync(filePath, `${toJsonLine(event)}\n`, "utf8");
}