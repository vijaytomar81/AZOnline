// src/execution/modes/data/runner.ts

import type { Logger } from "@utils/logger";
import { createLogger } from "@utils/logger";
import { resolveSchemaName } from "@data/data-definitions";
import { getCasesFile } from "@data/runtime/getCasesFile";
import { normalizeJourney } from "@config/domain/journey.config";
import { createExecutionBootstrap } from "@execution/core/bootstrap";
import { runCases } from "@execution/core/caseRunner";
import type { ExecutionScenario } from "@execution/modes/e2e/scenario/types";

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

    const base = schemaName.replace(/_pcw_tool$/i, "");
    return normalizeJourney(base);
}

function buildLogger(verbose?: boolean): Logger {
    return createLogger({
        prefix: "[execution]",
        logLevel: verbose ? "debug" : "info",
        withTimestamp: true,
        logToFile: false,
    });
}

export async function runDataMode(args: {
    source: string;
    schemaArg?: string;
    iterations?: number;
    parallel?: number;
    verbose?: boolean;
}): Promise<void> {
    const log = buildLogger(args.verbose);
    const schemaName = resolveSchemaName(args.schemaArg, args.source);
    const casesFile = getCasesFile(args.source, schemaName);
    const bootstrap = createExecutionBootstrap({ log });
    const entryPoint = resolveEntryPoint(schemaName);

    const overrideByScenarioId = new Map<string, Record<string, unknown>>();
    const scenarios: ExecutionScenario[] = casesFile.cases.map((item) => {
        const scenarioId = item.scriptId ?? item.scriptName ?? "UNKNOWN_CASE";
        const scenarioName = item.scriptName ?? scenarioId;
        const journey = resolveJourney(schemaName, item);

        overrideByScenarioId.set(scenarioId, item.data ?? {});

        return {
            scenarioId,
            scenarioName,
            journey,
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
    });

    await runCases({
        mode: "data",
        environment: process.env.ENV ?? "DEV",
        scenarios,
        iterations: args.iterations ?? 1,
        parallel: args.parallel ?? 1,
        schema: schemaName,
        source: args.source,
        registry: bootstrap.executorRegistry,
        dataRegistry: bootstrap.stepDataRegistry,
        log,
        resolveOverrideStepData: (scenario) => overrideByScenarioId.get(scenario.scenarioId),
    });
}