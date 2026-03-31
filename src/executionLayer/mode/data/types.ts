// src/executionLayer/mode/data/types.ts

import type { CasesFile } from "@dataLayer/builder/types";
import type { ExecutionScenario } from "@executionLayer/contracts";

export type DataModeArgs = {
    source: string;
    schemaArg?: string;
    iterations?: number;
    parallel?: number;
    verbose?: boolean;
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
