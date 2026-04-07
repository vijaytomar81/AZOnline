// src/executionLayer/logging/dataCase/renderDataCaseBlock.ts

import { muted, success } from "@utils/cliFormat";
import type {
    ExecutionScenario,
    ExecutionScenarioResult,
} from "@frameworkCore/executionLayer/contracts";
import {
    divider,
    field,
    renderFields,
    statusText,
} from "@frameworkCore/executionLayer/logging/shared";
import { buildDataCaseDetailFields } from "./buildDataCaseDetailFields";

export function renderDataCaseBlock(args: {
    scenario: ExecutionScenario;
    result: ExecutionScenarioResult;
    duration: string;
    verbose?: boolean;
}): string {
    const outputs = args.result.outputs ?? {};
    const item = args.result.itemResults[0];
    const failedItem = args.result.itemResults.find(
        (entry) => entry.status === "failed"
    );
    const lines: string[] = [];

    lines.push("");
    lines.push(
        `====================${muted("[DATA-CASE]")} ${success(
            args.scenario.scenarioId
        )}====================`
    );
    lines.push(field("TestCaseRef", args.scenario.scenarioId));
    lines.push(field("Journey", args.scenario.journey));
    lines.push(field("EntryPoint", args.scenario.entryPoint ?? "Direct"));
    lines.push("");

    lines.push(
        ...renderFields(
            buildDataCaseDetailFields({
                result: args.result,
                item,
                failedItem,
                outputs,
                verbose: args.verbose,
            }),
            16
        )
    );
    lines.push("");
    lines.push(field("Status", statusText(args.result.status)));
    lines.push(field("Duration", args.duration));
    lines.push(divider());

    return lines.join("\n");
}
