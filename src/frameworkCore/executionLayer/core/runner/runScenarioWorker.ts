// src/frameworkCore/executionLayer/core/runner/runScenarioWorker.ts

import type { ExecutionScenario } from "@frameworkCore/executionLayer/contracts";
import { formatDuration } from "@frameworkCore/executionLayer/logging";
import { runExecutionScenario } from "@frameworkCore/executionLayer/core/scenario";
import type { RunOutput, RunScenariosArgs } from "./types";
import { getScenarioScope } from "./getScenarioScope";
import { renderRunOutput } from "./renderRunOutput";

export async function runScenarioWorker(args: {
    scenario: ExecutionScenario;
    runArgs: RunScenariosArgs;
}): Promise<RunOutput> {
    const startedAtMs = Date.now();

    const result = await runExecutionScenario({
        scenario: args.scenario,
        registry: args.runArgs.registry,
        executionItemDataRegistry: args.runArgs.executionItemDataRegistry,
        logScope: getScenarioScope(args.scenario),
        overrideItemData: args.runArgs.resolveOverrideItemData?.(args.scenario),
        runId: args.runArgs.runId,
        workerId: args.runArgs.workerId,
        evidenceOutputRoot: args.runArgs.evidenceOutputRoot,
    });

    return {
        status: result.status,
        block: renderRunOutput({
            mode: args.runArgs.mode,
            scenario: args.scenario,
            result,
            duration: formatDuration(startedAtMs),
            verbose: args.runArgs.verbose,
        }),
        browser: (result as any).browser,
    };
}
