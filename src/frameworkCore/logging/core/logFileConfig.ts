// src/logging/core/logFileConfig.ts

import path from "node:path";
import type { LogCategory } from "./logCategories";
import { parseEnabledLogCategories } from "@frameworkCore/logging/utils/parseEnabledLogCategories";

function isTrue(value?: string): boolean {
    return String(value ?? "").trim().toLowerCase() === "true";
}

function buildRunId(): string {
    const iso = new Date().toISOString().replace(/[-:.TZ]/g, "");
    return `${iso}_${process.pid}`;
}

export type LogFileConfig = {
    enabled: boolean;
    baseDir: string;
    runId: string;
    enabledCategories: Set<LogCategory>;
    splitByCategory: boolean;
    splitByProcess: boolean;
};

function buildLogFileConfig(): LogFileConfig {
    const enabled = isTrue(process.env.LOG_WRITE_TO_FILE);
    const baseDir = process.env.LOG_FILE_DIR?.trim() || path.join("results", "logs");
    const runId = process.env.LOG_RUN_ID?.trim() || buildRunId();

    const categoriesInput =
        process.env.LOG_FILE_CATEGORIES ??
        process.env.LOG_CATEGORIES ??
        "all";

    return {
        enabled,
        baseDir,
        runId,
        enabledCategories: parseEnabledLogCategories(categoriesInput),
        splitByCategory: !isTrue(process.env.LOG_FILE_SPLIT_BY_CATEGORY)
            ? true
            : true,
        splitByProcess: !isTrue(process.env.LOG_FILE_SPLIT_BY_PROCESS)
            ? true
            : true,
    };
}

export const logFileConfig: LogFileConfig = buildLogFileConfig();