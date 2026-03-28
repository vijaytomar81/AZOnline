// src/execution/modes/data/core/buildScenarioFromCase.ts

import type { CasesFile } from "@data/builder/types";
import type { ExecutionScenario } from "@execution/modes/e2e/scenario/types";
import { resolveDataJourney } from "./resolveDataJourney";

export function buildScenarioFromCase(args: {
    schemaName: string;
    entryPoint: "Direct" | "PCW" | "PCWTool";
    item: CasesFile["cases"][number];
}): ExecutionScenario {
    const { schemaName, entryPoint, item } = args;

    const scenarioId = item.scriptId ?? item.scriptName ?? "UNKNOWN_CASE";
    const scenarioName = item.scriptName ?? scenarioId;

    return {
        scenarioId,
        scenarioName,
        journey: resolveDataJourney(schemaName, item),
        policyContext: "NewBusiness",
        entryPoint,
        description: scenarioName,
        execute: true,
        totalSteps: 1,
        steps: [
            {
                stepNo: 1,
                action: "NewBusiness",
                subType: "",
                portal: "",
                testCaseId: scenarioId,
            },
        ],
    };
}
