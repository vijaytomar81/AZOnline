// src/execution/runtime/stepData/resolve/resolveStepData.ts

import { AppError } from "@utils/errors";
import { normalizeSpaces } from "@utils/text";
import type { ScenarioStep } from "@execution/modes/e2e/scenario/types";
import type { ResolvedStepData, StepDataResolverRegistry } from "../types";
import { emitResolverDebug } from "../utils/emitResolverDebug";
import { getOrLoadStepCasesFile } from "../utils/getOrLoadStepCasesFile";
import { findStepCase } from "./findStepCase";
import { findStepDataSource } from "./findStepDataSource";

export function resolveStepData(args: {
    registry: StepDataResolverRegistry;
    journey: string;
    step: ScenarioStep;
    logScope: string;
    debugCollector?: { push(message: string): void };
}): ResolvedStepData {
    const testCaseId = normalizeSpaces(args.step.testCaseId);

    emitResolverDebug({
        message:
            `Resolving step data -> action=${args.step.action}, journey=${args.journey}, ` +
            `subType=${args.step.subType ?? ""}, testCaseId=${testCaseId}`,
        logScope: args.logScope,
        debugCollector: args.debugCollector,
    });

    const source = findStepDataSource({
        registry: args.registry,
        journey: args.journey,
        step: args.step,
    });

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

    const casesFile = getOrLoadStepCasesFile({
        registry: args.registry,
        source,
        logScope: args.logScope,
        debugCollector: args.debugCollector,
    });

    const hit = findStepCase({
        casesFile,
        testCaseId,
    });

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
