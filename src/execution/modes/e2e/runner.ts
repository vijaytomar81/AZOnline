// src/execution/modes/e2e/runner.ts

import { AppError } from "@utils/errors";
import { createLogger } from "@utils/logger";
import { startTimer } from "@utils/time";
import { createExecutionBootstrap } from "@execution/core/bootstrap";
import { loadScenarioSheet } from "@execution/runtime/loadScenarioSheet";
import { runScenario } from "@execution/core/scenarioRunner";
import { parseScenarios } from "./scenario/parser";
import type { ExecutionScenario } from "./scenario/types";

export type RunE2EModeArgs = {
    excelPath: string;
    sheetName: string;
    selectedIds: string[];
    includeDisabled: boolean;
    iterations: number;
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
    const timer = startTimer();
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

    let passed = 0;
    let failed = 0;

    for (let i = 1; i <= args.iterations; i++) {
        for (const scenario of scenarios) {
            const scenarioToRun = {
                ...scenario,
                scenarioId:
                    args.iterations > 1
                        ? `${scenario.scenarioId}#ITER${i}`
                        : scenario.scenarioId,
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

    log.info(
        `Execution completed -> total=${scenarios.length * args.iterations}, passed=${passed}, failed=${failed}`
    );
    log.info(`Total time -> ${timer.elapsedSecondsText()}`);
}