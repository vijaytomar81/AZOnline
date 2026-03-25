// src/execution/runtime/resolveStepData.ts

import { AppError } from "@utils/errors";
import { normalizeSpaces } from "@utils/text";
import { getCasesFile } from "../../data/runtime/getCasesFile";
import type { CasesFile } from "../../data/builder/types";
import type { Logger } from "@utils/logger";
import type { ScenarioStep } from "@execution/modes/e2e/scenario/types";

export type StepDataSource = {
    action: string;
    sheetName: string;
    schemaName?: string;
    journey?: string;
    subType?: string;
};

export type ResolvedStepData = {
    testCaseId: string;
    payload: Record<string, unknown>;
    source: StepDataSource;
    sourceFileSheet: string;
};

export type StepDataResolverRegistry = {
    sources: StepDataSource[];
    cache: Map<string, CasesFile>;
};

type DebugCollector = {
    push: (message: string) => void;
};

function normalizeKey(value?: string): string {
    return normalizeSpaces(String(value ?? ""))
        .toLowerCase()
        .replace(/\s+/g, "");
}

function emitDebug(
    message: string,
    log?: Logger,
    debugCollector?: DebugCollector
): void {
    const text = normalizeSpaces(message);
    if (!text) return;

    if (debugCollector) {
        debugCollector.push(text);
        return;
    }

    log?.debug(text);
}

function buildCacheKey(source: StepDataSource): string {
    return [
        normalizeKey(source.action),
        normalizeKey(source.schemaName),
        normalizeKey(source.sheetName),
    ].join("|");
}

function matchesSource(
    step: ScenarioStep,
    journey: string,
    source: StepDataSource
): boolean {
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

function getOrLoadCasesFile(args: {
    registry: StepDataResolverRegistry;
    source: StepDataSource;
    log?: Logger;
    debugCollector?: DebugCollector;
}): CasesFile {
    const key = buildCacheKey(args.source);
    const cached = args.registry.cache.get(key);

    if (cached) {
        emitDebug(`Step data cache hit -> key=${key}`, args.log, args.debugCollector);
        return cached;
    }

    emitDebug(
        `Step data cache miss -> key=${key}. Loading cases file...`,
        args.log,
        args.debugCollector
    );

    const loaded = getCasesFile(args.source.sheetName, args.source.schemaName);
    args.registry.cache.set(key, loaded);

    return loaded;
}

export function createStepDataResolverRegistry(): StepDataResolverRegistry {
    return {
        sources: [],
        cache: new Map<string, CasesFile>(),
    };
}

export function registerStepDataSource(
    registry: StepDataResolverRegistry,
    source: StepDataSource
): void {
    registry.sources.push(source);
}

export function resolveStepData(args: {
    registry: StepDataResolverRegistry;
    journey: string;
    step: ScenarioStep;
    log?: Logger;
    debugCollector?: DebugCollector;
}): ResolvedStepData {
    const testCaseId = normalizeSpaces(args.step.testCaseId);

    emitDebug(
        `Resolving step data -> action=${args.step.action}, journey=${args.journey}, ` +
        `subType=${args.step.subType ?? ""}, testCaseId=${testCaseId}`,
        args.log,
        args.debugCollector
    );

    const source = args.registry.sources.find((item) =>
        matchesSource(args.step, args.journey, item)
    );

    if (!source) {
        throw new AppError({
            code: "STEP_DATA_SOURCE_NOT_FOUND",
            stage: "resolve-step-data",
            source: "resolveStepData",
            message:
                `No step data source registered for action="${args.step.action}", ` +
                `journey="${args.journey}", subType="${args.step.subType ?? ""}".`,
            context: {
                action: args.step.action,
                journey: args.journey,
                subType: args.step.subType ?? "",
                testCaseId,
            },
        });
    }

    emitDebug(
        `Matched step data source -> action=${source.action}, ` +
        `journey=${source.journey ?? ""}, subType=${source.subType ?? ""}, ` +
        `sheet=${source.sheetName}, schema=${source.schemaName ?? ""}`,
        args.log,
        args.debugCollector
    );

    const casesFile = getOrLoadCasesFile({
        registry: args.registry,
        source,
        log: args.log,
        debugCollector: args.debugCollector,
    });

    const hit = casesFile.cases.find(
        (item) => item.scriptId === testCaseId || item.scriptName === testCaseId
    );

    if (!hit) {
        throw new AppError({
            code: "STEP_TEST_CASE_NOT_FOUND",
            stage: "resolve-step-data",
            source: "resolveStepData",
            message:
                `TestCaseId "${testCaseId}" not found in sheet "${source.sheetName}" ` +
                `for action "${args.step.action}".`,
            context: {
                testCaseId,
                action: args.step.action,
                sheetName: source.sheetName,
                schemaName: source.schemaName ?? "",
            },
        });
    }

    emitDebug(
        `Resolved test case -> scriptId=${hit.scriptId ?? ""}, scriptName=${hit.scriptName}`,
        args.log,
        args.debugCollector
    );

    return {
        testCaseId,
        payload: hit.data,
        source,
        sourceFileSheet: casesFile.sheet,
    };
}