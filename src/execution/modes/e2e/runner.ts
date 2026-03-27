// src/execution/modes/e2e/runner.ts

import { AppError } from "@utils/errors";
import { LOG_CATEGORIES } from "@logging/core/logCategories";
import { LOG_LEVELS } from "@logging/core/logLevels";
import { createLogEvent, logEvent } from "@logging/log";
import { createExecutionBootstrap } from "@execution/core/bootstrap";
import { runCases } from "@execution/core/caseRunner";
import { loadScenarioSheet } from "@execution/runtime/loadScenarioSheet";
import { parseScenarios } from "@execution/modes/e2e/scenario/parser";
import type { ExecutionScenario } from "@execution/modes/e2e/scenario/types";

export type RunE2EModeArgs = {
    excelPath: string;
    sheetName: string;
    selectedIds: string[];
    includeDisabled: boolean;
    iterations: number;
    parallel?: number;
    verbose: boolean;
};

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

function filterScenarios(
    scenarios: ExecutionScenario[],
    selectedIds: string[]
): ExecutionScenario[] {
    if (!selectedIds.length) {
        return scenarios;
    }

    const wanted = new Set(selectedIds);
    return scenarios.filter((item) => wanted.has(item.scenarioId));
}

function ensureScenariosExist(scenarios: ExecutionScenario[]): void {
    if (scenarios.length) {
        return;
    }

    throw new AppError({
        code: "NO_SCENARIOS_SELECTED",
        stage: "scenario-selection",
        source: "e2eRunner",
        message: "No scenarios selected for execution.",
    });
}

async function loadAndParseScenarios(args: {
    excelPath: string;
    sheetName: string;
    includeDisabled: boolean;
}): Promise<ExecutionScenario[]> {
    const loaded = await loadScenarioSheet({
        excelPath: args.excelPath,
        sheetName: args.sheetName,
        logScope: "execution:loader",
    });

    const parsed = parseScenarios(loaded.rows, {
        includeDisabled: args.includeDisabled,
        failOnTemplateErrors: true,
        failOnValidationErrors: true,
    });

    return parsed.scenarios;
}

export async function runE2EMode(args: RunE2EModeArgs): Promise<void> {
    emitFrameworkLog(
        LOG_LEVELS.INFO,
        `Mode -> e2e | excel=${args.excelPath} | sheet=${args.sheetName} | iterations=${args.iterations}`
    );

    const bootstrap = createExecutionBootstrap();

    const parsedScenarios = await loadAndParseScenarios({
        excelPath: args.excelPath,
        sheetName: args.sheetName,
        includeDisabled: args.includeDisabled,
    });

    const scenarios = filterScenarios(parsedScenarios, args.selectedIds);
    ensureScenariosExist(scenarios);

    emitFrameworkLog(
        LOG_LEVELS.INFO,
        `E2E scenarios resolved -> count=${scenarios.length}`
    );

    await runCases({
        mode: "e2e",
        environment: process.env.ENV ?? "DEV",
        scenarios,
        iterations: args.iterations,
        parallel: args.parallel ?? 1,
        verbose: args.verbose,
        sheet: args.sheetName,
        registry: bootstrap.executorRegistry,
        dataRegistry: bootstrap.stepDataRegistry,
    });
}