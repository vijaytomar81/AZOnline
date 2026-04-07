// src/executionLayer/mode/data/buildDataScenarios.ts

import type { CasesFile } from "@dataLayer/builder/types";
import type {
    Application,
    Product,
} from "@configLayer/domain/routing.config";
import { buildScenarioFromCase } from "./buildScenarioFromCase";
import type {
    BuildDataScenariosResult,
    DataScenarioOverrideMap,
} from "./types";

export function buildDataScenarios(args: {
    source: string;
    schemaName: string;
    casesFile: CasesFile;
    application?: Application;
    product?: Product;
}): BuildDataScenariosResult {
    const overrideByScenarioId: DataScenarioOverrideMap = new Map();

    const scenarios = args.casesFile.cases.map((item) => {
        const scenario = buildScenarioFromCase({
            source: args.source,
            schemaName: args.schemaName,
            item,
            application: args.application,
            product: args.product,
        });

        overrideByScenarioId.set(scenario.scenarioId, item.data ?? {});
        return scenario;
    });

    return {
        scenarios,
        overrideByScenarioId,
    };
}
