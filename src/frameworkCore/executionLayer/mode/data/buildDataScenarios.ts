// src/frameworkCore/executionLayer/mode/data/buildDataScenarios.ts

import type { CasesFile } from "@dataLayer/builder/types";
import type { Platform } from "@configLayer/models/platform.config";
import type { Application } from "@configLayer/models/application.config";
import type { Product } from "@configLayer/models/product.config";
import { buildScenarioFromCase } from "./buildScenarioFromCase";
import type {
    BuildDataScenariosResult,
    DataScenarioOverrideMap,
} from "./types";

export function buildDataScenarios(args: {
    casesFile: CasesFile;
    platform: Platform;
    application: Application;
    product: Product;
}): BuildDataScenariosResult {
    const overrideByScenarioId: DataScenarioOverrideMap = new Map();

    const scenarios = args.casesFile.cases.map((item) => {
        const scenario = buildScenarioFromCase({
            item,
            platform: args.platform,
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
