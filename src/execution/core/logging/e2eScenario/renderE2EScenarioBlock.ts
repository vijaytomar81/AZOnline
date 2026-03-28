// src/execution/core/logging/e2eScenario/renderE2EScenarioBlock.ts

import { success } from "@utils/cliFormat";
import type { ExecutionScenario } from "@execution/modes/e2e/scenario/types";
import type { ScenarioExecutionResult } from "@execution/core/result";
import {
    field,
    statusText,
} from "@execution/core/logging/shared";
import { renderStepBlock } from "./renderStepBlock";

export function renderE2EScenarioBlock(args: {
    scenario: ExecutionScenario;
    result: ScenarioExecutionResult;
    duration: string;
    verbose?: boolean;
}): string {
    const { scenario, result, duration, verbose } = args;
    const outputs = result.outputs ?? {};
    const lines: string[] = [];

    lines.push("");
    lines.push(
        `====================${success("[SCENARIO]")} ${scenario.scenarioId} | ${scenario.scenarioName}====================`
    );
    lines.push(field("ScenarioId", scenario.scenarioId));
    lines.push(field("ScenarioName", scenario.scenarioName));
    lines.push(field("Journey", scenario.journey));
    lines.push(field("PolicyContext", scenario.policyContext));
    lines.push(field("EntryPoint", scenario.entryPoint ?? "Direct"));
    lines.push(field("TotalSteps", scenario.totalSteps));
    lines.push("");

    result.stepResults.forEach((step, index) => {
        lines.push(
            ...renderStepBlock({
                step,
                index,
                total: result.stepResults.length,
                outputs,
                verbose,
            })
        );
    });

    lines.push("");
    lines.push(field("ScenarioStatus", statusText(result.status)));
    lines.push(field("ScenarioTime", duration));
    lines.push("============================================================");

    return lines.join("\n");
}
