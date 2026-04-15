// src/frameworkCore/executionLayer/logging/e2eScenario/renderE2EScenarioBlock.ts

import type {
    ExecutionScenario,
    ExecutionScenarioResult,
} from "@frameworkCore/executionLayer/contracts";
import { field, statusText } from "../shared";
import { renderExecutionItemBlock } from "./renderExecutionItemBlock";

export function renderE2EScenarioBlock(args: {
    scenario: ExecutionScenario;
    result: ExecutionScenarioResult;
    duration?: string;
    verbose?: boolean;
}): string {
    const lines: string[] = [];
    const itemResults = args.result.itemResults ?? [];

    lines.push("");
    lines.push(
        `====================[SCENARIO] ${args.scenario.scenarioId} | ${args.scenario.scenarioName}====================`
    );
    lines.push(field("ScenarioId", args.scenario.scenarioId));
    lines.push(field("ScenarioName", args.scenario.scenarioName));
    lines.push(field("Platform", args.scenario.platform));
    lines.push(field("Application", args.scenario.application));
    lines.push(field("Product", args.scenario.product));
    lines.push(field("JourneyStartWith", args.scenario.journeyStartWith));
    lines.push(field("PolicyNumber", args.scenario.policyNumber ?? ""));
    lines.push(field("LoginId", args.scenario.loginId ?? ""));
    lines.push(field("Description", args.scenario.description));
    lines.push(field("TotalItems", String(args.scenario.totalItems)));
    lines.push("");

    itemResults.forEach((item, index) => {
        renderExecutionItemBlock({
            item,
            index,
            total: itemResults.length,
            outputs:
                (item.details?.outputs as Record<string, unknown>) ?? {},
            verbose: args.verbose,
        }).forEach((line) => {
            lines.push(line);
        });
    });

    lines.push("");
    lines.push(field("ScenarioStatus", statusText(args.result.status)));
    lines.push(field("ScenarioTime", args.duration ?? ""));
    lines.push("============================================================");

    return lines.join("\n");
}
