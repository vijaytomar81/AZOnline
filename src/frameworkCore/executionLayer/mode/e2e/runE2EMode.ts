// src/frameworkCore/executionLayer/mode/e2e/runE2EMode.ts

import { EXECUTION_MODES } from "@configLayer/executionModes";
import { LOG_CATEGORIES } from "@frameworkCore/logging/core/logCategories";
import { LOG_LEVELS } from "@frameworkCore/logging/core/logLevels";
import { emitLog } from "@frameworkCore/logging/emitLog";
import { createExecutionBootstrap } from "@frameworkCore/executionLayer/core/bootstrap";
import { runScenarios } from "@frameworkCore/executionLayer/core/runner";
import { registerDefaultExecutors } from "@frameworkCore/executionLayer/runtime/defaults";
import { ensureScenariosExist } from "./ensureScenariosExist";
import { filterScenarios } from "./filterScenarios";
import { loadAndParseScenarios } from "./loadAndParseScenarios";
import type { RunE2EModeArgs } from "./types";

export async function runE2EMode(
    args: RunE2EModeArgs
): Promise<void> {
    emitLog({
        scope: "run",
        level: LOG_LEVELS.INFO,
        category: LOG_CATEGORIES.FRAMEWORK,
        message: `Mode -> ${EXECUTION_MODES.E2E} | excel=${args.excelPath} | sheet=${args.sheetName} | iterations=${args.iterations}`,
    });

    const bootstrap = createExecutionBootstrap();

    registerDefaultExecutors(bootstrap);

    const parsedScenarios = await loadAndParseScenarios({
        excelPath: args.excelPath,
        sheetName: args.sheetName,
        includeDisabled: args.includeDisabled,
        platform: args.platform,
        application: args.application,
        product: args.product,
    });

    const scenarios = filterScenarios(parsedScenarios, args.selectedIds);
    ensureScenariosExist(scenarios);

    emitLog({
        scope: "run",
        level: LOG_LEVELS.INFO,
        category: LOG_CATEGORIES.FRAMEWORK,
        message: `E2E scenarios resolved -> count=${scenarios.length}`,
    });

    await runScenarios({
        mode: EXECUTION_MODES.E2E,
        environment: args.environment,
        scenarios,
        iterations: args.iterations,
        parallel: args.parallel ?? 1,
        verbose: args.verbose,
        sheet: args.sheetName,
        registry: bootstrap.executorRegistry,
        executionItemDataRegistry: bootstrap.executionItemDataRegistry,
        platform: args.platform,
        application: args.application,
        product: args.product,
    });
}
