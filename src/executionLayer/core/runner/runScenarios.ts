// src/executionLayer/core/runner/runScenarios.ts

import {
    formatDuration,
    renderExecutionHeader,
    renderExecutionSummary,
} from "@executionLayer/logging";
import { countExecutionStatuses } from "./countExecutionStatuses";
import { expandScenarios } from "./expandScenarios";
import { runScenarioBatch } from "./runScenarioBatch";
import { runScenarioWorker } from "./runScenarioWorker";
import type { RunScenariosArgs } from "./types";

export async function runScenarios(
    args: RunScenariosArgs
): Promise<void> {
    const startedAtMs = Date.now();
    const parallel = Math.max(1, args.parallel ?? 1);
    const runs = expandScenarios(args.scenarios, args.iterations);

    console.log(
        renderExecutionHeader({
            mode: args.mode,
            environment: args.environment,
            iterations: args.iterations,
            parallel,
            schema: args.schema,
            source: args.source,
            sheet: args.sheet,
            totalCases: args.mode === "data" ? runs.length : undefined,
            totalScenarios: args.mode === "e2e" ? runs.length : undefined,
        })
    );

    const outputs = await runScenarioBatch(
        runs,
        parallel,
        async (scenario) =>
            runScenarioWorker({
                scenario,
                runArgs: args,
            })
    );

    outputs.forEach((item) => {
        console.log(item.block);
    });

    const { passed, failed } = countExecutionStatuses(outputs);

    console.log(
        renderExecutionSummary({
            total: runs.length,
            passed,
            failed,
            totalTime: formatDuration(startedAtMs),
        })
    );
}
