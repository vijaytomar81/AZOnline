// src/frameworkCore/executionLayer/core/runner/renderRunOutput.ts

import type {
    ExecutionScenario,
    ExecutionScenarioResult,
} from "@frameworkCore/executionLayer/contracts";
import { renderDataCaseBlock } from "@frameworkCore/executionLayer/logging/dataCase";
import { renderE2EScenarioBlock } from "@frameworkCore/executionLayer/logging/e2eScenario";

export function renderRunOutput(args: {
    mode: "data" | "e2e";
    scenario: ExecutionScenario;
    result: ExecutionScenarioResult;
    duration?: string;
    verbose?: boolean;
}): string {
    if (args.mode === "data") {
        return renderDataCaseBlock({
            scenario: args.scenario,
            result: args.result,
            verbose: args.verbose,
        });
    }

    return renderE2EScenarioBlock({
        scenario: args.scenario,
        result: args.result,
        verbose: args.verbose,
    });
}
