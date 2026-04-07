// src/executionLayer/mode/data/types.ts

import type { CasesFile } from "@dataLayer/builder/types";
import type { ExecutionScenario } from "@frameworkCore/executionLayer/contracts";
import type {
    Application,
    Product,
} from "@configLayer/domain/routing.config";

export type DataModeArgs = {
    source: string;
    schemaArg?: string;
    iterations?: number;
    parallel?: number;
    verbose?: boolean;
    application?: Application;
    product?: Product;
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
