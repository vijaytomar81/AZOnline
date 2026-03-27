// src/execution/runtime/resolveStepData.ts

import { AppError } from "@utils/errors";
import { normalizeSpaces } from "@utils/text";
import type { CasesFile } from "@data/builder/types";
import type { ScenarioStep } from "@execution/modes/e2e/scenario/types";
import {
    emitResolverDebug,
    getOrLoadCasesFile,
    matchesSource,
} from "./stepDataResolverUtils";

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

export type DebugCollector = {
    push: (message: string) => void;
};

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
    logScope: string;
    debugCollector?: DebugCollector;
}): ResolvedStepData {
    const testCaseId = normalizeSpaces(args.step.testCaseId);

    emitResolverDebug({
        message:
            `Resolving step data -> action=${args.step.action}, journey=${args.journey}, ` +
            `subType=${args.step.subType ?? ""}, testCaseId=${testCaseId}`,
        logScope: args.logScope,
        debugCollector: args.debugCollector,
    });

    const source = args.registry.sources.find((item) =>
        matchesSource({
            step: args.step,
            journey: args.journey,
            source: item,
        })
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

    emitResolverDebug({
        message:
            `Matched step data source -> action=${source.action}, ` +
            `journey=${source.journey ?? ""}, subType=${source.subType ?? ""}, ` +
            `sheet=${source.sheetName}, schema=${source.schemaName ?? ""}`,
        logScope: args.logScope,
        debugCollector: args.debugCollector,
    });

    const casesFile = getOrLoadCasesFile({
        registry: args.registry,
        source,
        logScope: args.logScope,
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

    emitResolverDebug({
        message: `Resolved test case -> scriptId=${hit.scriptId ?? ""}, scriptName=${hit.scriptName}`,
        logScope: args.logScope,
        debugCollector: args.debugCollector,
    });

    return {
        testCaseId,
        payload: hit.data,
        source,
        sourceFileSheet: casesFile.sheet,
    };
}