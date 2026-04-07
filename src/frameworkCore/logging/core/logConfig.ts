// src/logging/core/logConfig.ts

import type { LogCategory } from "./logCategories";
import { parseEnabledLogCategories } from "@frameworkCore/logging/utils/parseEnabledLogCategories";

function isTrue(value?: string): boolean {
    return String(value ?? "").trim().toLowerCase() === "true";
}

export type LogConfig = {
    verbose: boolean;
    enabledCategories: Set<LogCategory>;
};

function readVerboseFromEnv(): boolean {
    return isTrue(process.env.LOG_VERBOSE ?? process.env.DEBUG_VERBOSE);
}

function readCategoriesFromEnv(): Set<LogCategory> {
    const categoriesInput =
        process.env.LOG_CATEGORIES ??
        process.env.LOG_ENABLED_CATEGORIES;

    return parseEnabledLogCategories(categoriesInput);
}

function buildLogConfig(): LogConfig {
    return {
        verbose: readVerboseFromEnv(),
        enabledCategories: readCategoriesFromEnv(),
    };
}

export const logConfig: LogConfig = buildLogConfig();

export function setLogVerbose(verbose: boolean): void {
    logConfig.verbose = verbose;
}

export function setEnabledLogCategories(
    categories: Iterable<LogCategory>
): void {
    logConfig.enabledCategories = new Set(categories);
}

export function refreshLogConfigFromEnv(): void {
    logConfig.verbose = readVerboseFromEnv();
    logConfig.enabledCategories = readCategoriesFromEnv();
}