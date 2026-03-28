// src/execution/modes/data/core/runDataMode.ts

import { resolveSchemaName } from "@data/data-definitions";
import { getCasesFile } from "@data/runtime/cases/getCasesFile";
import { createExecutionBootstrap } from "@execution/core/bootstrap";
import { runCases } from "@execution/core/case/runCases";
import { LOG_CATEGORIES } from "@logging/core/logCategories";
import { LOG_LEVELS } from "@logging/core/logLevels";
import { emitLog } from "@logging/emitLog";
import { buildDataScenarios } from "./buildDataScenarios";
import type { DataModeArgs } from "./types";

export async function runDataMode(args: DataModeArgs): Promise<void> {
    const schemaName = resolveSchemaName(args.schemaArg, args.source);

    emitLog({
        scope: "run",
        level: LOG_LEVELS.INFO,
        category: LOG_CATEGORIES.FRAMEWORK,
        message: `Mode -> data | source=${args.source} | schema=${schemaName} | iterations=${args.iterations ?? 1}`,
    });

    const casesFile = getCasesFile(args.source, schemaName);
    const bootstrap = createExecutionBootstrap();

    const { scenarios, overrideByScenarioId } = buildDataScenarios({
        schemaName,
        casesFile,
    });

    emitLog({
        scope: "run",
        level: LOG_LEVELS.INFO,
        category: LOG_CATEGORIES.FRAMEWORK,
        message: `Data cases resolved -> count=${scenarios.length}`,
    });

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
