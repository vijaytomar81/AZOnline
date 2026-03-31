// src/executionLayer/mode/data/buildDataScenarios.ts

import type { CasesFile } from "@dataLayer/builder/types";
import { buildScenarioFromCase } from "./buildScenarioFromCase";
import type {
    BuildDataScenariosResult,
    DataScenarioOverrideMap,
} from "./types";

export function buildDataScenarios(args: {
    schemaName: string;
    casesFile: CasesFile;
}): BuildDataScenariosResult {
    const overrideByScenarioId: DataScenarioOverrideMap = new Map();

    const scenarios = args.casesFile.cases.map((item) => {
        const scenario = buildScenarioFromCase({
            schemaName: args.schemaName,
            item,
        });

        overrideByScenarioId.set(scenario.scenarioId, item.data ?? {});
        return scenario;
    });

    return {
        scenarios,
        overrideByScenarioId,
    };
}
