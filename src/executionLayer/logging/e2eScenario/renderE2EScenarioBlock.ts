// src/executionLayer/logging/e2eScenario/renderE2EScenarioBlock.ts

import { success } from "@utils/cliFormat";
import type {
    ExecutionScenario,
    ExecutionScenarioResult,
} from "@executionLayer/contracts";
import { field, statusText } from "@executionLayer/logging/shared";
import { renderExecutionItemBlock } from "./renderExecutionItemBlock";

export function renderE2EScenarioBlock(args: {
    scenario: ExecutionScenario;
    result: ExecutionScenarioResult;
    duration: string;
    verbose?: boolean;
}): string {
    const outputs = args.result.outputs ?? {};
    const lines: string[] = [];

    lines.push("");
    lines.push(
        `====================${success("[SCENARIO]")} ${args.scenario.scenarioId} | ${args.scenario.scenarioName}====================`
    );
    lines.push(field("ScenarioId", args.scenario.scenarioId));
    lines.push(field("ScenarioName", args.scenario.scenarioName));
    lines.push(field("Journey", args.scenario.journey));
    lines.push(field("PolicyContext", args.scenario.policyContext));
    lines.push(field("EntryPoint", args.scenario.entryPoint ?? "Direct"));
    lines.push(field("TotalItems", args.scenario.totalItems));
    lines.push("");

    args.result.itemResults.forEach((item, index) => {
        lines.push(
            ...renderExecutionItemBlock({
                item,
                index,
                total: args.result.itemResults.length,
                outputs,
                verbose: args.verbose,
            })
        );
    });

    lines.push("");
    lines.push(field("ScenarioStatus", statusText(args.result.status)));
    lines.push(field("ScenarioTime", args.duration));
    lines.push("============================================================");

    return lines.join("\n");
}
