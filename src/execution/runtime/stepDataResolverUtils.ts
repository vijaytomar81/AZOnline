// src/execution/runtime/stepDataResolverUtils.ts

import { normalizeSpaces } from "@utils/text";
import { LOG_CATEGORIES } from "@logging/core/logCategories";
import { LOG_LEVELS } from "@logging/core/logLevels";
import { createLogEvent, logEvent } from "@logging/log";
import { getCasesFile } from "@data/runtime/cases/getCasesFile";
import type { CasesFile } from "@data/builder/types";
import type { ScenarioStep } from "@execution/modes/e2e/scenario/types";
import type {
    DebugCollector,
    StepDataResolverRegistry,
    StepDataSource,
} from "./resolveStepData";

export function normalizeKey(value?: string): string {
    return normalizeSpaces(String(value ?? ""))
        .toLowerCase()
        .replace(/\s+/g, "");
}

export function emitResolverDebug(args: {
    message: string;
    logScope: string;
    debugCollector?: DebugCollector;
}): void {
    const text = normalizeSpaces(args.message);

    if (!text) {
        return;
    }

    if (args.debugCollector) {
        args.debugCollector.push(text);
        return;
    }

    logEvent(createLogEvent({
        level: LOG_LEVELS.DEBUG,
        category: LOG_CATEGORIES.TECHNICAL,
        message: text,
        scope: args.logScope,
    }));
}

export function buildCacheKey(source: StepDataSource): string {
    return [
        normalizeKey(source.action),
        normalizeKey(source.schemaName),
        normalizeKey(source.sheetName),
    ].join("|");
}

export function matchesSource(args: {
    step: ScenarioStep;
    journey: string;
    source: StepDataSource;
}): boolean {
    const { step, journey, source } = args;

    if (normalizeKey(step.action) !== normalizeKey(source.action)) {
        return false;
    }

    if (source.journey && normalizeKey(journey) !== normalizeKey(source.journey)) {
        return false;
    }

    if (source.subType && normalizeKey(step.subType) !== normalizeKey(source.subType)) {
        return false;
    }

    return true;
}

export function getOrLoadCasesFile(args: {
    registry: StepDataResolverRegistry;
    source: StepDataSource;
    logScope: string;
    debugCollector?: DebugCollector;
}): CasesFile {
    const key = buildCacheKey(args.source);
    const cached = args.registry.cache.get(key);

    if (cached) {
        emitResolverDebug({
            message: `Step data cache hit -> key=${key}`,
            logScope: args.logScope,
            debugCollector: args.debugCollector,
        });
        return cached;
    }

    emitResolverDebug({
        message: `Step data cache miss -> key=${key}. Loading cases file...`,
        logScope: args.logScope,
        debugCollector: args.debugCollector,
    });

    const loaded = getCasesFile(args.source.sheetName, args.source.schemaName);
    args.registry.cache.set(key, loaded);

    return loaded;
}