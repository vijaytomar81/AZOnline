// src/execution/core/case/runCases/runCaseWorker.ts

import type { ExecutionScenario } from "@execution/modes/e2e/scenario/types";
import { formatDuration } from "@execution/core/caseLogger";
import { runScenario } from "@execution/core/scenarioRunner";
import { renderCaseRunOutput } from "@execution/core/case/renderCaseRunOutput";
import type { CaseRunOutput } from "@execution/core/case/runCaseOutput";
import { getScenarioScope } from "./getScenarioScope";
import type { RunCasesArgs } from "./types";

export async function runCaseWorker(args: {
    scenario: ExecutionScenario;
    runCasesArgs: RunCasesArgs;
}): Promise<CaseRunOutput> {
    const caseStartedAtMs = Date.now();

    const result = await runScenario({
        scenario: args.scenario,
        registry: args.runCasesArgs.registry,
        dataRegistry: args.runCasesArgs.dataRegistry,
        logScope: getScenarioScope(args.scenario),
        overrideStepData: args.runCasesArgs.resolveOverrideStepData?.(args.scenario),
        mode: args.runCasesArgs.mode,
    });

    const block = renderCaseRunOutput({
        mode: args.runCasesArgs.mode,
        scenario: args.scenario,
        result,
        duration: formatDuration(caseStartedAtMs),
        verbose: args.runCasesArgs.verbose,
    });

    return {
        status: result.status,
        block,
    };
}
