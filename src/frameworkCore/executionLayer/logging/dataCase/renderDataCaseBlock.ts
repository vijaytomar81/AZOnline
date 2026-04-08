// src/frameworkCore/executionLayer/logging/dataCase/renderDataCaseBlock.ts

import type {
    ExecutionScenario,
    ExecutionScenarioResult,
} from "@frameworkCore/executionLayer/contracts";
import { field } from "../shared";

export function renderDataCaseBlock(args: {
    scenario: ExecutionScenario;
    result: ExecutionScenarioResult;
}): string {
    const lines: string[] = [];

    lines.push(`DATA SCENARIO :: ${args.scenario.scenarioId}`);
    lines.push(field("Scenario", args.scenario.scenarioName));
    lines.push(field("Status", args.result.status));
    lines.push(field("Platform", args.scenario.platform));
    lines.push(field("Application", args.scenario.application));
    lines.push(field("Product", args.scenario.product));
    lines.push(field("JourneyStartWith", args.scenario.journeyStartWith));
    lines.push(field("Description", args.scenario.description));
    lines.push(field("Items", String(args.scenario.totalItems)));

    return lines.join("\n");
}
