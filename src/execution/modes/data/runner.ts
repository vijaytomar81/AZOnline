// src/execution/modes/data/runner.ts

import { LOG_CATEGORIES } from "@logging/core/logCategories";
import { LOG_LEVELS } from "@logging/core/logLevels";
import { createLogEvent, logEvent } from "@logging/log";
import { resolveSchemaName } from "@data/data-definitions";
import { getCasesFile } from "@data/runtime/getCasesFile";
import { normalizeJourney } from "@config/domain/journey.config";
import { createExecutionBootstrap } from "@execution/core/bootstrap";
import { runCases } from "@execution/core/caseRunner";
import type { ExecutionScenario } from "@execution/modes/e2e/scenario/types";
import type { CasesFile } from "@data/builder/types";

type DataModeArgs = {
    source: string;
    schemaArg?: string;
    iterations?: number;
    parallel?: number;
    verbose?: boolean;
};

type ScenarioOverrideMap = Map<string, Record<string, unknown>>;

function emitFrameworkLog(
    level: "debug" | "info" | "warn" | "error",
    message: string
): void {
    logEvent(createLogEvent({
        level,
        category: LOG_CATEGORIES.FRAMEWORK,
        message,
        scope: "run",
    }));
}

function resolveEntryPoint(schemaName: string): "Direct" | "PCW" | "PCWTool" {
    if (schemaName === "direct" || schemaName === "master") return "Direct";
    if (schemaName.includes("pcw_tool")) return "PCWTool";
    return "PCW";
}

function resolveJourney(
    schemaName: string,
    builtCase: { data?: Record<string, unknown> }
): string {
    if (schemaName === "direct" || schemaName === "master") {
        return "Direct";
    }

    if (schemaName === "pcw_tool") {
        const pcwTool = (builtCase.data?.pcwTool ?? {}) as Record<string, unknown>;
        const raw =
            String(pcwTool.journey ?? "").trim() ||
            String(pcwTool.pcwToolPortal ?? "").trim();

        return normalizeJourney(raw || "CTM");
    }

    return normalizeJourney(schemaName.replace(/_pcw_tool$/i, ""));
}

function buildScenarioFromCase(args: {
    schemaName: string;
    entryPoint: "Direct" | "PCW" | "PCWTool";
    item: CasesFile["cases"][number];
}): ExecutionScenario {
    const { schemaName, entryPoint, item } = args;
    const scenarioId = item.scriptId ?? item.scriptName ?? "UNKNOWN_CASE";
    const scenarioName = item.scriptName ?? scenarioId;

    return {
        scenarioId,
        scenarioName,
        journey: resolveJourney(schemaName, item),
        policyContext: "NewBusiness",
        entryPoint,
        description: scenarioName,
        execute: true,
        totalSteps: 1,
        steps: [
            {
                stepNo: 1,
                action: "NewBusiness",
                subType: "",
                portal: "",
                testCaseId: scenarioId,
            },
        ],
    };
}

function buildScenarios(args: {
    schemaName: string;
    casesFile: CasesFile;
}): {
    scenarios: ExecutionScenario[];
    overrideByScenarioId: ScenarioOverrideMap;
} {
    const entryPoint = resolveEntryPoint(args.schemaName);
    const overrideByScenarioId: ScenarioOverrideMap = new Map();

    const scenarios = args.casesFile.cases.map((item) => {
        const scenario = buildScenarioFromCase({
            schemaName: args.schemaName,
            entryPoint,
            item,
        });

        overrideByScenarioId.set(scenario.scenarioId, item.data ?? {});
        return scenario;
    });

    return { scenarios, overrideByScenarioId };
}

export async function runDataMode(args: DataModeArgs): Promise<void> {
    const schemaName = resolveSchemaName(args.schemaArg, args.source);

    emitFrameworkLog(
        LOG_LEVELS.INFO,
        `Mode -> data | source=${args.source} | schema=${schemaName} | iterations=${args.iterations ?? 1}`
    );

    const casesFile = getCasesFile(args.source, schemaName);
    const bootstrap = createExecutionBootstrap();

    const { scenarios, overrideByScenarioId } = buildScenarios({
        schemaName,
        casesFile,
    });

    emitFrameworkLog(
        LOG_LEVELS.INFO,
        `Data cases resolved -> count=${scenarios.length}`
    );

    await runCases({
        mode: "data",
        environment: process.env.ENV ?? "DEV",
        scenarios,
        iterations: args.iterations ?? 1,
        parallel: args.parallel ?? 1,
        verbose: args.verbose,
        schema: schemaName,
        source: args.source,
        registry: bootstrap.executorRegistry,
        dataRegistry: bootstrap.stepDataRegistry,
        resolveOverrideStepData: (scenario) =>
            overrideByScenarioId.get(scenario.scenarioId),
    });
}