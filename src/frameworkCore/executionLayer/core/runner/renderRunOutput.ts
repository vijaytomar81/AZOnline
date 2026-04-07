// src/executionLayer/core/runner/renderRunOutput.ts

import type {
    ExecutionScenario,
    ExecutionScenarioResult,
    ExecutionMode,
} from "@frameworkCore/executionLayer/contracts";
import {
    renderDataCaseBlock,
    renderE2EScenarioBlock,
} from "@frameworkCore/executionLayer/logging";

export function renderRunOutput(args: {
    mode: ExecutionMode;
    scenario: ExecutionScenario;
    result: ExecutionScenarioResult;
    duration: string;
    verbose?: boolean;
}): string {
    if (args.mode === "data") {
        return renderDataCaseBlock({
            scenario: args.scenario,
            result: args.result,
            duration: args.duration,
            verbose: args.verbose,
        });
    }

    return renderE2EScenarioBlock({
        scenario: args.scenario,
        result: args.result,
        duration: args.duration,
        verbose: args.verbose,
    });
}
