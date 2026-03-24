// src/execution/modes/data/runner.ts

import { dataDefinitionRegistry } from "../../../data/data-definitions/registry";
import { resolveSchemaName } from "../../../data/data-definitions";
import { getCasesFile } from "../../../data/runtime/getCasesFile";
import { AppError } from "@utils/errors";
import { createLogger, type Logger } from "@utils/logger";
import { startTimer } from "@utils/time";
import type { ExecutionScenario } from "../e2e/scenario/types";
import { createExecutionBootstrap } from "@execution/core/bootstrap";
import { runScenario } from "@execution/core/scenarioRunner";

const DEFAULT_ITERATIONS = 1;

export type RunDataModeArgs = {
    source: string;
    schemaArg?: string;
    iterations?: number;
    verbose?: boolean;
};

function resolveEntryPoint(schemaName: string): "Direct" | "PCW" | "PCWTool" {
    if (schemaName === "direct" || schemaName === "master") return "Direct";
    if (schemaName === "pcw_tool" || schemaName.endsWith("_pcw_tool")) return "PCWTool";
    return "PCW";
}

function resolveJourney(source: string, schemaName: string): string {
    if (schemaName === "direct" || schemaName === "master") return "Direct";
    return source;
}

function validateSchema(schemaName: string): void {
    const def = dataDefinitionRegistry[schemaName];

    if (!def || def.schema.dataDefinitionGroup !== "newBusiness") {
        throw new AppError({
            code: "DATA_MODE_SCHEMA_NOT_SUPPORTED",
            stage: "data-runner",
            source: "dataRunner",
            message: `Schema "${schemaName}" is not supported for data mode.`,
        });
    }
}

export async function runDataMode(args: RunDataModeArgs): Promise<void> {
    const iterations = args.iterations ?? DEFAULT_ITERATIONS;

    const log: Logger = createLogger({
        prefix: "[execution]",
        logLevel: args.verbose ? "debug" : "info",
        withTimestamp: true,
        logToFile: false,
    });

    const timer = startTimer();

    // ✅ Resolve schema dynamically
    const schemaName = resolveSchemaName(args.schemaArg, args.source);
    validateSchema(schemaName);

    // ✅ Load generated JSON (NO build here)
    let casesFile;
    try {
        casesFile = getCasesFile(args.source, schemaName);
    } catch {
        throw new AppError({
            code: "DATA_JSON_NOT_FOUND",
            stage: "data-load",
            source: "dataRunner",
            message: [
                `Generated data JSON not found for source "${args.source}".`,
                "",
                "Next step:",
                `  npm run data:build -- --excel <path> --sheet "${args.source}"`,
            ].join("\n"),
        });
    }

    const bootstrap = createExecutionBootstrap({ log });

    const entryPoint = resolveEntryPoint(schemaName);
    const journey = resolveJourney(args.source, schemaName);

    log.info(
        `Mode -> data | source=${args.source} | schema=${schemaName} | iterations=${iterations}`
    );
    log.info(`Cases ready for execution: ${casesFile.cases.length}`);

    let passed = 0;
    let failed = 0;

    for (let i = 1; i <= iterations; i++) {
        for (const builtCase of casesFile.cases) {
            // ✅ FIX: handle undefined safely
            const scriptName =
                builtCase.scriptName ??
                builtCase.scriptId ??
                "UNKNOWN_CASE";

            const scriptId = builtCase.scriptId ?? scriptName;

            const scenario: ExecutionScenario = {
                scenarioId:
                    iterations > 1 ? `${scriptName}#ITER${i}` : scriptName,
                scenarioName: scriptName,
                journey,
                policyContext: "NewBusiness",
                entryPoint,
                description: builtCase.description ?? scriptName,
                execute: true,
                totalSteps: 1,
                steps: [
                    {
                        stepNo: 1,
                        action: "NewBusiness",
                        subType: "",
                        portal: "CustomerPortal",
                        testCaseId: scriptId,
                    },
                ],
            };

            const result = await runScenario({
                scenario,
                registry: bootstrap.executorRegistry,
                dataRegistry: bootstrap.stepDataRegistry,
                log: log.child(scenario.scenarioId),
                overrideStepData: builtCase.data,
            });

            if (result.status === "passed") passed++;
            else failed++;
        }
    }

    log.info(
        `Execution completed -> total=${casesFile.cases.length * iterations
        }, passed=${passed}, failed=${failed}`
    );
    log.info(`Total time -> ${timer.elapsedSecondsText()}`);
}