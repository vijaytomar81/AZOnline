// src/frameworkCore/executionLayer/core/runner/renderRunOutput.ts

import type {
    ExecutionScenario,
    ExecutionScenarioResult,
} from "@frameworkCore/executionLayer/contracts";
import type { ExecutionMode } from "@configLayer/executionModes";
import { EXECUTION_MODES } from "@configLayer/executionModes";
import { renderDataCaseBlock } from "@frameworkCore/executionLayer/logging/dataCase";
import { renderE2EScenarioBlock } from "@frameworkCore/executionLayer/logging/e2eScenario";

export function renderRunOutput(args: {
    mode: ExecutionMode;
    scenario: ExecutionScenario;
    result: ExecutionScenarioResult;
    duration?: string;
    verbose?: boolean;
}): string {
    if (args.mode === EXECUTION_MODES.DATA) {
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