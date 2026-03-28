// src/execution/modes/e2e/core/runE2EMode.ts

import { createExecutionBootstrap } from "@execution/core/bootstrap";
import { runCases } from "@execution/core/case/runCases";
import { LOG_CATEGORIES } from "@logging/core/logCategories";
import { LOG_LEVELS } from "@logging/core/logLevels";
import { emitLog } from "@logging/emitLog";
import { ensureScenariosExist } from "./ensureScenariosExist";
import { filterScenarios } from "./filterScenarios";
import { loadAndParseScenarios } from "./loadAndParseScenarios";
import type { RunE2EModeArgs } from "./types";

export async function runE2EMode(args: RunE2EModeArgs): Promise<void> {
    emitLog({
        scope: "run",
        level: LOG_LEVELS.INFO,
        category: LOG_CATEGORIES.FRAMEWORK,
        message: `Mode -> e2e | excel=${args.excelPath} | sheet=${args.sheetName} | iterations=${args.iterations}`,
    });

    const bootstrap = createExecutionBootstrap();

    const parsedScenarios = await loadAndParseScenarios({
        excelPath: args.excelPath,
        sheetName: args.sheetName,
        includeDisabled: args.includeDisabled,
    });

    const scenarios = filterScenarios(parsedScenarios, args.selectedIds);
    ensureScenariosExist(scenarios);

    emitLog({
        scope: "run",
        level: LOG_LEVELS.INFO,
        category: LOG_CATEGORIES.FRAMEWORK,
        message: `E2E scenarios resolved -> count=${scenarios.length}`,
    });

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
