// src/execution/modes/data/core/buildDataScenarios.ts

import type { CasesFile } from "@data/builder/types";
import type { ExecutionScenario } from "@execution/modes/e2e/scenario/types";
import { resolveEntryPoint } from "./resolveEntryPoint";
import { buildScenarioFromCase } from "./buildScenarioFromCase";
import type { ScenarioOverrideMap } from "./types";

export function buildDataScenarios(args: {
    schemaName: string;
    casesFile: CasesFile;
}): {
    scenarios: ExecutionScenario[];
    overrideByScenarioId: ScenarioOverrideMap;
} {
    const entryPoint = resolveEntryPoint(args.schemaName);
    const overrideByScenarioId: ScenarioOverrideMap = new Map();

    const scenarios = args.casesFile.cases.map((item) => {
        const scenario = buildScenarioFromCase({
            schemaName: args.schemaName,
            entryPoint,
            item,
        });

        overrideByScenarioId.set(scenario.scenarioId, item.data ?? {});
        return scenario;
    });

    return { scenarios, overrideByScenarioId };
}
