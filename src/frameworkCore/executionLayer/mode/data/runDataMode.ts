// src/frameworkCore/executionLayer/mode/data/runDataMode.ts

import { getCasesFile } from "@dataLayer/runtime/cases/getCasesFile";
import { LOG_CATEGORIES } from "@frameworkCore/logging/core/logCategories";
import { LOG_LEVELS } from "@frameworkCore/logging/core/logLevels";
import { emitLog } from "@frameworkCore/logging/emitLog";
import { createExecutionBootstrap } from "@frameworkCore/executionLayer/core/bootstrap";
import { runScenarios } from "@frameworkCore/executionLayer/core/runner";
import { registerDefaultExecutors } from "@frameworkCore/executionLayer/runtime/defaults";
import { buildDataScenarios } from "./buildDataScenarios";
import type { DataModeArgs } from "./types";
import { environments } from "@configLayer/environments";

export async function runDataMode(
    args: DataModeArgs
): Promise<void> {
    emitLog({
        scope: "run",
        level: LOG_LEVELS.INFO,
        category: LOG_CATEGORIES.FRAMEWORK,
        message:
            `Mode -> data | platform=${args.platform} | application=${args.application} | ` +
            `product=${args.product} | journey=${args.journeyContext.type}`,
    });

    const casesFile = getCasesFile({
        platform: args.platform,
        application: args.application,
        product: args.product,
        journeyContext: args.journeyContext,
        sheetName: "generated",
    });

    const bootstrap = createExecutionBootstrap();
    registerDefaultExecutors(bootstrap);

    const { scenarios, overrideByScenarioId } = buildDataScenarios({
        casesFile,
        platform: args.platform,
        application: args.application,
        product: args.product,
    });

    emitLog({
        scope: "run",
        level: LOG_LEVELS.INFO,
        category: LOG_CATEGORIES.FRAMEWORK,
        message: `Data cases resolved -> count=${scenarios.length}`,
    });

    await runScenarios({
        mode: "data",
        environment: environments.defaultEnv,
        scenarios,
        iterations: args.iterations ?? 1,
        parallel: args.parallel ?? 1,
        verbose: args.verbose,
        registry: bootstrap.executorRegistry,
        executionItemDataRegistry: bootstrap.executionItemDataRegistry,
        resolveOverrideItemData: (scenario) =>
            overrideByScenarioId.get(scenario.scenarioId),
    });
}
