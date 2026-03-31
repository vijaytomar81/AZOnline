// src/executionLayer/mode/data/buildScenarioFromCase.ts

import type { ExecutionScenario } from "@executionLayer/contracts";
import type { BuiltCaseLike } from "./types";
import { resolveDataJourney } from "./resolveDataJourney";
import { resolveEntryPoint } from "./resolveEntryPoint";

export function buildScenarioFromCase(args: {
    schemaName: string;
    item: BuiltCaseLike;
}): ExecutionScenario {
    const scenarioId = args.item.scriptId ?? args.item.scriptName ?? "UNKNOWN_CASE";
    const scenarioName = args.item.scriptName ?? scenarioId;
    const entryPoint = resolveEntryPoint(args.schemaName);

    return {
        scenarioId,
        scenarioName,
        journey: resolveDataJourney({
            schemaName: args.schemaName,
            builtCase: args.item,
        }),
        policyContext: "NewBusiness",
        entryPoint,
        description: scenarioName,
        execute: true,
        totalItems: 1,
        items: [
            {
                itemNo: 1,
                action: "NewBusiness",
                subType: undefined,
                portal: undefined,
                testCaseRef: scenarioId,
            },
        ],
    };
}
