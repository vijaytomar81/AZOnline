// src/execution/modes/e2e/runner.ts

import { AppError } from "@utils/errors";
import { createLogger } from "@utils/logger";
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

function filterScenarios(
    scenarios: ExecutionScenario[],
    selectedIds: string[]
): ExecutionScenario[] {
    if (!selectedIds.length) return scenarios;
    const wanted = new Set(selectedIds);
    return scenarios.filter((item) => wanted.has(item.scenarioId));
}

export async function runE2EMode(args: RunE2EModeArgs): Promise<void> {
    const log = createLogger({
        prefix: "[execution]",
        logLevel: args.verbose ? "debug" : "info",
        withTimestamp: true,
        logToFile: false,
    });

    log.info(
        `Mode -> e2e | excel=${args.excelPath} | sheet=${args.sheetName} | iterations=${args.iterations}`
    );

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
            source: "e2eRunner",
            message: "No scenarios selected for execution.",
        });
    }

    await runCases({
        mode: "e2e",
        environment: process.env.ENV ?? "DEV",
        scenarios,
        iterations: args.iterations,
        parallel: args.parallel ?? 1,
        sheet: args.sheetName,
        registry: bootstrap.executorRegistry,
        dataRegistry: bootstrap.stepDataRegistry,
        log,
    });
}