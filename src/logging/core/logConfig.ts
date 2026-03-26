// src/logging/core/logConfig.ts

import type { LogCategory } from "./logCategories";
import { parseEnabledLogCategories } from "@logging/utils/parseEnabledLogCategories";

function isTrue(value?: string): boolean {
    return String(value ?? "").trim().toLowerCase() === "true";
}

export type LogConfig = {
    verbose: boolean;
    enabledCategories: Set<LogCategory>;
};

function buildLogConfig(): LogConfig {
    const verbose = isTrue(
        process.env.LOG_VERBOSE ?? process.env.DEBUG_VERBOSE
    );

    const categoriesInput =
        process.env.LOG_CATEGORIES ??
        process.env.LOG_ENABLED_CATEGORIES;

    return {
        verbose,
        enabledCategories: parseEnabledLogCategories(categoriesInput),
    };
}

export const logConfig: LogConfig = buildLogConfig();