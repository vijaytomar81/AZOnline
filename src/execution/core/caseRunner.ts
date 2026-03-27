// src/execution/core/caseRunner.ts

import type { ExecutionScenario } from "@execution/modes/e2e/scenario/types";
import type { ExecutorRegistry } from "@execution/core/registry";
import type { StepDataResolverRegistry } from "@execution/runtime/resolveStepData";
import {
    formatDuration,
    renderDataCaseBlock,
    renderE2EScenarioBlock,
    renderExecutionHeader,
    renderExecutionSummary,
} from "@execution/core/caseLogger";
import { runScenario } from "@execution/core/scenarioRunner";

type ExecutionMode = "data" | "e2e";

type RunCasesArgs = {
    mode: ExecutionMode;
    environment: string;
    scenarios: ExecutionScenario[];
    iterations: number;
    parallel?: number;
    schema?: string;
    source?: string;
    sheet?: string;
    verbose?: boolean;
    registry: ExecutorRegistry;
    dataRegistry: StepDataResolverRegistry;
    resolveOverrideStepData?: (
        scenario: ExecutionScenario
    ) => Record<string, unknown> | undefined;
};

type CaseRunOutput = {
    status: "passed" | "failed";
    block: string;
};

async function runInBatches<T, R>(
    items: T[],
    batchSize: number,
    worker: (item: T) => Promise<R>
): Promise<R[]> {
    const results: R[] = [];

    for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        const batchResults = await Promise.all(batch.map(worker));
        results.push(...batchResults);
    }

    return results;
}

function expandScenarios(
    scenarios: ExecutionScenario[],
    iterations: number
): ExecutionScenario[] {
    const runs: ExecutionScenario[] = [];

    for (let i = 1; i <= iterations; i++) {
        for (const scenario of scenarios) {
            runs.push(
                iterations > 1
                    ? { ...scenario, scenarioId: `${scenario.scenarioId}#ITER${i}` }
                    : scenario
            );
        }
    }

    return runs;
}

function getScenarioScope(scenario: ExecutionScenario): string {
    return `execution:${scenario.scenarioId}`;
}

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

    const outputs = await runInBatches(
        runs,
        parallel,
        async (scenario): Promise<CaseRunOutput> => {
            const caseStartedAtMs = Date.now();

            const result = await runScenario({
                scenario,
                registry: args.registry,
                dataRegistry: args.dataRegistry,
                logScope: getScenarioScope(scenario),
                overrideStepData: args.resolveOverrideStepData?.(scenario),
                mode: args.mode,
            });

            const duration = formatDuration(caseStartedAtMs);
            const block =
                args.mode === "data"
                    ? renderDataCaseBlock({
                        scenario,
                        result,
                        duration,
                        verbose: args.verbose,
                    })
                    : renderE2EScenarioBlock({
                        scenario,
                        result,
                        duration,
                        verbose: args.verbose,
                    });

            return { status: result.status, block };
        }
    );

    let passed = 0;
    let failed = 0;

    for (const item of outputs) {
        console.log(item.block);
        if (item.status === "passed") {
            passed++;
        } else {
            failed++;
        }
    }

    console.log(
        renderExecutionSummary({
            total: runs.length,
            passed,
            failed,
            totalTime: formatDuration(startedAtMs),
        })
    );
}