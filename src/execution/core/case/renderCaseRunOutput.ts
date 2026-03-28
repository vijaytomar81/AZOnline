// src/execution/core/case/renderCaseRunOutput.ts

import type { ExecutionScenario } from "@execution/modes/e2e/scenario/types";
import type { ScenarioExecutionResult } from "@execution/core/result";
import {
    renderDataCaseBlock,
    renderE2EScenarioBlock,
} from "@execution/core/caseLogger";

type ExecutionMode = "data" | "e2e";

export function renderCaseRunOutput(args: {
    mode: ExecutionMode;
    scenario: ExecutionScenario;
    result: ScenarioExecutionResult;
    duration: string;
    verbose?: boolean;
}): string {
    return args.mode === "data"
        ? renderDataCaseBlock({
            scenario: args.scenario,
            result: args.result,
            duration: args.duration,
            verbose: args.verbose,
        })
        : renderE2EScenarioBlock({
            scenario: args.scenario,
            result: args.result,
            duration: args.duration,
            verbose: args.verbose,
        });
}
