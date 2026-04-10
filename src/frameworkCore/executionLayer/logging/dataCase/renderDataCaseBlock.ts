// src/frameworkCore/executionLayer/logging/dataCase/renderDataCaseBlock.ts

import type {
    ExecutionItemResult,
    ExecutionScenario,
    ExecutionScenarioResult,
} from "@frameworkCore/executionLayer/contracts";
import { field, renderFields, statusText } from "../shared";
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
    duration?: string;
    verbose?: boolean;
}): string {
    const lines: string[] = [];
    const item = firstItem(args.result);
    const failed = failedItem(args.result);
    const outputs =
        ((failed?.details?.outputs ??
            item?.details?.outputs ??
            args.result.outputs) as Record<string, unknown>) ?? {};

    lines.push("");
    lines.push(
        `====================[DATA-CASE] ${args.scenario.scenarioId}====================`
    );
    lines.push(field("ScenarioId", args.scenario.scenarioId));
    lines.push(field("ScenarioName", args.scenario.scenarioName));
    lines.push(field("Platform", args.scenario.platform));
    lines.push(field("Application", args.scenario.application));
    lines.push(field("Product", args.scenario.product));
    lines.push(field("JourneyStartWith", args.scenario.journeyStartWith));
    // lines.push(field("TotalItems", String(args.scenario.totalItems)));
    lines.push("");

    const detailFields = buildDataCaseDetailFields({
        result: args.result,
        item,
        failedItem: failed,
        outputs,
        verbose: args.verbose,
    });

    if (detailFields.length) {
        renderFields(detailFields, 16).forEach((line) => {
            lines.push(line);
        });
        lines.push("");
    }

    lines.push(field("Status", statusText(args.result.status)));
    lines.push(field("Duration", args.duration ?? ""));
    lines.push("------------------------------------------------------------");

    return lines.join("\n");
}
