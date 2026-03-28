// src/execution/modes/data/core/types.ts

export type DataModeArgs = {
    source: string;
    schemaArg?: string;
    iterations?: number;
    parallel?: number;
    verbose?: boolean;
};

export type ScenarioOverrideMap = Map<string, Record<string, unknown>>;
