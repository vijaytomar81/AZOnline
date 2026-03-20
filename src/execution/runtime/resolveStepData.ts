// src/execution/runtime/resolveStepData.ts

import { normalizeSpaces } from "../../utils/text";
import { getCasesFile } from "../../data/runtime/getCasesFile";
import type { CasesFile } from "../../data/builder/types";
import type { Logger } from "../../utils/logger";
import type { ScenarioStep } from "../scenario/types";

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

function normalizeKey(value?: string): string {
    return normalizeSpaces(String(value ?? ""))
        .toLowerCase()
        .replace(/\s+/g, "");
}

function buildCacheKey(source: StepDataSource): string {
    return [
        normalizeKey(source.action),
        normalizeKey(source.schemaName),
        normalizeKey(source.sheetName),
    ].join("|");
}

function matchesSource(step: ScenarioStep, journey: string, source: StepDataSource): boolean {
    if (normalizeKey(step.action) !== normalizeKey(source.action)) return false;
    if (source.journey && normalizeKey(journey) !== normalizeKey(source.journey)) {
        return false;
    }
    if (source.subType && normalizeKey(step.subType) !== normalizeKey(source.subType)) {
        return false;
    }
    return true;
}

function getOrLoadCasesFile(
    registry: StepDataResolverRegistry,
    source: StepDataSource,
    log?: Logger
): CasesFile {
    const key = buildCacheKey(source);
    const cached = registry.cache.get(key);

    if (cached) {
        log?.debug(`Step data cache hit -> key=${key}`);
        return cached;
    }

    log?.debug(`Step data cache miss -> key=${key}. Loading cases file...`);
    const loaded = getCasesFile(source.sheetName, source.schemaName);
    registry.cache.set(key, loaded);
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
}): ResolvedStepData {
    const testCaseId = normalizeSpaces(args.step.testCaseId);
    args.log?.debug(
        `Resolving step data -> action=${args.step.action}, journey=${args.journey}, ` +
        `subType=${args.step.subType ?? ""}, testCaseId=${testCaseId}`
    );

    const source = args.registry.sources.find((item) =>
        matchesSource(args.step, args.journey, item)
    );

    if (!source) {
        throw new Error(
            `No step data source registered for action="${args.step.action}", ` +
            `journey="${args.journey}", subType="${args.step.subType ?? ""}".`
        );
    }

    args.log?.debug(
        `Matched step data source -> action=${source.action}, ` +
        `journey=${source.journey ?? ""}, subType=${source.subType ?? ""}, ` +
        `sheet=${source.sheetName}, schema=${source.schemaName ?? ""}`
    );

    const casesFile = getOrLoadCasesFile(args.registry, source, args.log);
    const hit = casesFile.cases.find(
        (item) => item.scriptId === testCaseId || item.scriptName === testCaseId
    );

    if (!hit) {
        throw new Error(
            `TestCaseId "${testCaseId}" not found in sheet "${source.sheetName}" ` +
            `for action "${args.step.action}".`
        );
    }

    args.log?.debug(
        `Resolved test case -> scriptId=${hit.scriptId ?? ""}, scriptName=${hit.scriptName}`
    );

    return {
        testCaseId,
        payload: hit.data,
        source,
        sourceFileSheet: casesFile.sheet,
    };
}