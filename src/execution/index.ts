// src/execution/index.ts

import { dataDefinitionRegistry } from "../data/data-definitions/registry";
import { resolveSchemaName } from "../data/data-definitions";
import { getCasesFile } from "../data/runtime/getCasesFile";
import { AppError } from "../utils/errors";
import { getArg, hasFlag, normalizeArgv } from "../utils/argv";
import { createLogger } from "../utils/logger";
import { startTimer } from "../utils/time";
import { normalizeSpaces } from "../utils/text";
import { createExecutionBootstrap } from "./runtime/bootstrap";
import { printDataModeHelp } from "./runtime/dataModeHelp";
import { loadScenarioSheet } from "./runtime/loadScenarioSheet";
import { runScenario } from "./runners/scenarioRunner";
import { parseScenarios } from "./scenario/parser";
import type { ExecutionScenario } from "./scenario/types";
import { usage } from "./help";

type ExecutionMode = "e2e" | "data";
const DEFAULT_ITERATIONS = 1;

function normalizeMode(raw?: string): ExecutionMode {
    return normalizeSpaces(String(raw ?? "e2e")).toLowerCase() === "data"
        ? "data"
        : "e2e";
}

function parseScenarioFilter(raw?: string): string[] {
    return normalizeSpaces(String(raw ?? ""))
        .split(",")
        .map((item) => normalizeSpaces(item))
        .filter(Boolean);
}

function parseIterations(raw?: string): number {
    const value = normalizeSpaces(String(raw ?? ""));
    if (!value) return DEFAULT_ITERATIONS;

    const num = Number(value);
    if (!Number.isInteger(num) || num <= 0) {
        throw new AppError({
            code: "INVALID_ITERATIONS",
            stage: "cli-parse",
            source: "execution-index",
            message: `Invalid --iterations value "${value}". It must be a positive integer.`,
        });
    }

    return num;
}

function filterScenarios(
    scenarios: ExecutionScenario[],
    selectedIds: string[]
): ExecutionScenario[] {
    if (!selectedIds.length) return scenarios;
    const wanted = new Set(selectedIds);
    return scenarios.filter((item) => wanted.has(item.scenarioId));
}

function resolveDataEntryPoint(schemaName: string): "Direct" | "PCW" | "PCWTool" {
    if (schemaName === "direct" || schemaName === "master") return "Direct";
    if (schemaName === "pcw_tool" || schemaName.endsWith("_pcw_tool")) return "PCWTool";
    return "PCW";
}

function resolveDataJourney(source: string, schemaName: string): string {
    if (schemaName === "direct" || schemaName === "master") return "Direct";
    return source;
}

function isDataModeSchema(schemaName: string): boolean {
    const def = dataDefinitionRegistry[schemaName];
    return !!def && def.schema.dataDefinitionGroup === "newBusiness";
}

async function runE2EMode(args: {
    excelPath: string;
    sheetName: string;
    selectedIds: string[];
    includeDisabled: boolean;
    iterations: number;
    verbose: boolean;
}): Promise<void> {
    const timer = startTimer();
    const log = createLogger({
        prefix: "[execution]",
        logLevel: args.verbose ? "debug" : "info",
        withTimestamp: true,
        logToFile: false,
    });

    log.info(`Mode -> e2e | excel=${args.excelPath} | sheet=${args.sheetName} | iterations=${args.iterations}`);

    const bootstrap = createExecutionBootstrap({ log });
    const loaded = await loadScenarioSheet({
        excelPath: args.excelPath,
        sheetName: args.sheetName,
        log: log.child("loader"),
    });

    const parsed = parseScenarios(loaded.rows, {
        includeDisabled: args.includeDisabled,
        failOnTemplateErrors: true,
        failOnValidationErrors: true,
    });

    const scenarios = filterScenarios(parsed.scenarios, args.selectedIds);
    if (!scenarios.length) {
        throw new AppError({
            code: "NO_SCENARIOS_SELECTED",
            stage: "scenario-selection",
            source: "execution-index",
            message: "No scenarios selected for execution.",
        });
    }

    let passed = 0;
    let failed = 0;

    for (let i = 1; i <= args.iterations; i++) {
        for (const scenario of scenarios) {
            const scenarioToRun = {
                ...scenario,
                scenarioId: args.iterations > 1 ? `${scenario.scenarioId}#ITER${i}` : scenario.scenarioId,
            };

            const result = await runScenario({
                scenario: scenarioToRun,
                registry: bootstrap.executorRegistry,
                dataRegistry: bootstrap.stepDataRegistry,
                log: log.child(scenarioToRun.scenarioId),
            });

            if (result.status === "passed") passed++;
            else failed++;
        }
    }

    log.info(`Execution completed -> total=${scenarios.length * args.iterations}, passed=${passed}, failed=${failed}`);
    log.info(`Total time -> ${timer.elapsedSecondsText()}`);
}

async function runDataMode(args: {
    source: string;
    schemaArg?: string;
    iterations: number;
    verbose: boolean;
}): Promise<void> {
    const timer = startTimer();
    const log = createLogger({
        prefix: "[execution]",
        logLevel: args.verbose ? "debug" : "info",
        withTimestamp: true,
        logToFile: false,
    });

    const schemaName = resolveSchemaName(args.schemaArg, args.source);
    if (!isDataModeSchema(schemaName)) {
        throw new AppError({
            code: "DATA_MODE_SCHEMA_NOT_SUPPORTED",
            stage: "data-source-load",
            source: "execution-index",
            message: `Schema "${schemaName}" is not supported for data mode.`,
        });
    }

    let casesFile;
    try {
        casesFile = getCasesFile(args.source, schemaName);
    } catch {
        throw new AppError({
            code: "DATA_JSON_NOT_FOUND",
            stage: "data-source-load",
            source: "execution-index",
            message: [
                `Generated data JSON not found for source "${args.source}".`,
                "",
                "Next step:",
                `  Build data first, for example: npm run data:build -- --excel <workbook-path> --sheet "${args.source}"`,
            ].join("\n"),
        });
    }

    const bootstrap = createExecutionBootstrap({ log });
    const entryPoint = resolveDataEntryPoint(schemaName);
    const journey = resolveDataJourney(args.source, schemaName);

    log.info(`Mode -> data | source=${args.source} | schema=${schemaName} | iterations=${args.iterations}`);
    log.info(`Cases ready for execution: ${casesFile.cases.length}`);

    let passed = 0;
    let failed = 0;

    for (let i = 1; i <= args.iterations; i++) {
        for (const builtCase of casesFile.cases) {
            const scenario: ExecutionScenario = {
                scenarioId: args.iterations > 1 ? `${builtCase.scriptName}#ITER${i}` : builtCase.scriptName,
                scenarioName: builtCase.scriptName,
                journey,
                policyContext: "NewBusiness",
                entryPoint,
                description: builtCase.description ?? builtCase.scriptName,
                execute: true,
                totalSteps: 1,
                steps: [
                    {
                        stepNo: 1,
                        action: "NewBusiness",
                        subType: "",
                        portal: "CustomerPortal",
                        testCaseId: builtCase.scriptId ?? builtCase.scriptName,
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

    log.info(`Execution completed -> total=${casesFile.cases.length * args.iterations}, passed=${passed}, failed=${failed}`);
    log.info(`Total time -> ${timer.elapsedSecondsText()}`);
}

async function main(): Promise<void> {
    const argv = normalizeArgv(process.argv.slice(2));
    const mode = normalizeMode(String(getArg(argv, "--mode") ?? "e2e"));

    if (hasFlag(argv, "--help") || hasFlag(argv, "-h")) {
        if (mode === "data") printDataModeHelp();
        else console.log(usage());
        return;
    }

    const verbose = hasFlag(argv, "--verbose");
    const iterations = parseIterations(String(getArg(argv, "--iterations") ?? ""));

    if (mode === "data") {
        const source = normalizeSpaces(String(getArg(argv, "--source") ?? ""));
        const schemaArg = normalizeSpaces(String(getArg(argv, "--schema") ?? ""));
        if (!source) {
            throw new AppError({
                code: "EXECUTION_MISSING_SOURCE",
                stage: "cli-parse",
                source: "execution-index",
                message: "Missing --source for data mode.",
            });
        }
        await runDataMode({ source, schemaArg: schemaArg || undefined, iterations, verbose });
        return;
    }

    const excelPath = normalizeSpaces(String(getArg(argv, "--excel") ?? ""));
    const sheetName = normalizeSpaces(String(getArg(argv, "--sheet") ?? ""));
    const selectedIds = parseScenarioFilter(String(getArg(argv, "--scenario") ?? ""));
    const includeDisabled = hasFlag(argv, "--includeDisabled");

    if (!excelPath) throw new AppError({ code: "EXECUTION_MISSING_EXCEL", stage: "cli-parse", source: "execution-index", message: "Missing --excel" });
    if (!sheetName) throw new AppError({ code: "EXECUTION_MISSING_SHEET", stage: "cli-parse", source: "execution-index", message: "Missing --sheet" });

    await runE2EMode({ excelPath, sheetName, selectedIds, includeDisabled, iterations, verbose });
}

main().catch((error: unknown) => {
    const log = createLogger({
        prefix: "[execution]",
        logLevel: "debug",
        withTimestamp: true,
        logToFile: false,
    });

    if (error instanceof AppError) {
        log.error(`❌ [${error.code ?? "APP_ERROR"}] ${error.message}`);
        if (error.stage || error.source) {
            log.error(`Stage: ${error.stage ?? "unknown"} | Source: ${error.source ?? "unknown"}`);
        }
        if (error.context) {
            log.error(`Context: ${JSON.stringify(error.context, null, 2)}`);
        }
    } else {
        log.error(error instanceof Error ? error.message : String(error));
    }

    process.exit(1);
});