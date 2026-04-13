// src/frameworkCore/executionLayer/mode/data/types.ts

import type { CasesFile } from "@dataLayer/builder/types";
import type { ExecutionScenario } from "@frameworkCore/executionLayer/contracts";
import type { EnvKey } from "@configLayer/environments";
import type { Platform } from "@configLayer/models/platform.config";
import type { Application } from "@configLayer/models/application.config";
import type { Product } from "@configLayer/models/product.config";
import type { JourneyContext } from "@configLayer/models/journeyContext.config";

export type DataModeArgs = {
    iterations?: number;
    parallel?: number;
    verbose?: boolean;
    environment: EnvKey;
    platform: Platform;
    application: Application;
    product: Product;
    journeyContext: JourneyContext;
};

export type DataScenarioOverrideMap = Map<
    string,
    Record<string, unknown>
>;

export type BuildDataScenariosResult = {
    scenarios: ExecutionScenario[];
    overrideByScenarioId: DataScenarioOverrideMap;
};

export type BuiltCaseLike = CasesFile["cases"][number];