// src/execution/core/logging/dataCase/renderDataCaseBlock.ts

import { muted, success } from "@utils/cliFormat";
import type { ExecutionScenario } from "@execution/modes/e2e/scenario/types";
import type { ScenarioExecutionResult } from "@execution/core/result";
import {
    divider,
    field,
    renderFields,
    statusText,
} from "@execution/core/logging/shared";
import { buildDataCaseDetailFields } from "./buildDataCaseDetailFields";

export function renderDataCaseBlock(args: {
    scenario: ExecutionScenario;
    result: ScenarioExecutionResult;
    duration: string;
    verbose?: boolean;
}): string {
    const { scenario, result, duration, verbose } = args;
    const outputs = result.outputs ?? {};
    const step = result.stepResults[0];
    const failedStep = result.stepResults.find((item) => item.status === "failed");
    const lines: string[] = [];

    lines.push("");
    lines.push(
        `====================${muted("[DATA-CASE]")} ${success(
            scenario.scenarioId
        )}====================`
    );
    lines.push(field("TestCaseId", scenario.scenarioId));
    lines.push(field("Journey", scenario.journey));
    lines.push(field("EntryPoint", scenario.entryPoint ?? "Direct"));
    lines.push("");

    lines.push(
        ...renderFields(
            buildDataCaseDetailFields({
                result,
                step,
                failedStep,
                outputs,
                verbose,
            }),
            16
        )
    );
    lines.push("");
    lines.push(field("Status", statusText(result.status)));
    lines.push(field("Duration", duration));
    lines.push(divider());

    return lines.join("\n");
}
