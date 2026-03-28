// src/execution/core/case/runCases/runCases.ts

import {
    formatDuration,
    renderExecutionHeader,
    renderExecutionSummary,
} from "@execution/core/caseLogger";
import { expandScenarios } from "@execution/core/case/expandScenarios";
import { runCaseBatch } from "@execution/core/case/runCaseBatch";
import { countCaseStatuses } from "./countCaseStatuses";
import { runCaseWorker } from "./runCaseWorker";
import type { RunCasesArgs } from "./types";

export async function runCases(args: RunCasesArgs): Promise<void> {
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

    const outputs = await runCaseBatch(
        runs,
        parallel,
        async (scenario) =>
            runCaseWorker({
                scenario,
                runCasesArgs: args,
            })
    );

    outputs.forEach((item) => {
        console.log(item.block);
    });

    const { passed, failed } = countCaseStatuses(outputs);

    console.log(
        renderExecutionSummary({
            total: runs.length,
            passed,
            failed,
            totalTime: formatDuration(startedAtMs),
        })
    );
}
