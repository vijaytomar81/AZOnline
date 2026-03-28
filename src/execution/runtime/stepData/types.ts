// src/execution/runtime/stepData/types.ts

import type { CasesFile } from "@data/builder/types";

export type StepDataSource = {
    action: string;
    sheetName: string;
    schemaName?: string;
    journey?: string;
    subType?: string;
};

export type ResolvedStepData = {
    testCaseId: string;
    payload: Record<string, unknown>;
    source: StepDataSource;
    sourceFileSheet: string;
};

export type StepDataResolverRegistry = {
    sources: StepDataSource[];
    cache: Map<string, CasesFile>;
};

export type DebugCollector = {
    push: (message: string) => void;
};
