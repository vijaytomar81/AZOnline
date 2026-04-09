// src/frameworkCore/executionLayer/logging/e2eScenario/renderE2EScenarioBlock.ts

import type {
    ExecutionScenario,
    ExecutionScenarioResult,
} from "@frameworkCore/executionLayer/contracts";
import { field } from "../shared";
import { renderExecutionItemBlock } from "./renderExecutionItemBlock";

export function renderE2EScenarioBlock(args: {
    scenario: ExecutionScenario;
    result: ExecutionScenarioResult;
    verbose?: boolean;
}): string {
    const lines: string[] = [];
    const itemResults = args.result.itemResults ?? [];

    lines.push(`E2E SCENARIO :: ${args.scenario.scenarioId}`);
    lines.push(field("Scenario", args.scenario.scenarioName));
    lines.push(field("Status", args.result.status));
    lines.push(field("Platform", args.scenario.platform));
    lines.push(field("Application", args.scenario.application));
    lines.push(field("Product", args.scenario.product));
    lines.push(field("JourneyStartWith", args.scenario.journeyStartWith));
    lines.push(field("PolicyNumber", args.scenario.policyNumber ?? ""));
    lines.push(field("LoginId", args.scenario.loginId ?? ""));
    lines.push(field("Description", args.scenario.description));
    lines.push(field("Items", String(args.scenario.totalItems)));

    if (itemResults.length) {
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
    }

    return lines.join("\n");
}
