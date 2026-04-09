// src/frameworkCore/executionLayer/logging/dataCase/renderDataCaseBlock.ts

import type {
    ExecutionItemResult,
    ExecutionScenario,
    ExecutionScenarioResult,
} from "@frameworkCore/executionLayer/contracts";
import { field, renderFields } from "../shared";
import { buildDataCaseDetailFields } from "./buildDataCaseDetailFields";

function firstItem(
    result: ExecutionScenarioResult
): ExecutionItemResult | undefined {
    return result.itemResults[0];
}

function failedItem(
    result: ExecutionScenarioResult
): ExecutionItemResult | undefined {
    return result.itemResults.find((item) => item.status === "failed");
}

export function renderDataCaseBlock(args: {
    scenario: ExecutionScenario;
    result: ExecutionScenarioResult;
    verbose?: boolean;
}): string {
    const lines: string[] = [];
    const item = firstItem(args.result);
    const failed = failedItem(args.result);
    const outputs =
        ((failed?.details?.outputs ??
            item?.details?.outputs ??
            args.result.outputs) as Record<string, unknown>) ?? {};

    lines.push(`DATA SCENARIO :: ${args.scenario.scenarioId}`);
    lines.push(field("Scenario", args.scenario.scenarioName));
    lines.push(field("Status", args.result.status));
    lines.push(field("Platform", args.scenario.platform));
    lines.push(field("Application", args.scenario.application));
    lines.push(field("Product", args.scenario.product));
    lines.push(field("JourneyStartWith", args.scenario.journeyStartWith));
    lines.push(field("Description", args.scenario.description));
    lines.push(field("Items", String(args.scenario.totalItems)));

    const detailFields = buildDataCaseDetailFields({
        result: args.result,
        item,
        failedItem: failed,
        outputs,
        verbose: args.verbose,
    });

    if (detailFields.length) {
        lines.push("");

        renderFields(detailFields, 16).forEach((line) => {
            lines.push(line);
        });
    }

    return lines.join("\n");
}
