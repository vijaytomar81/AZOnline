// src/execution/core/case/runCases/types.ts

import type { ExecutionScenario } from "@execution/modes/e2e/scenario/types";
import type { ExecutorRegistry } from "@execution/core/registry";
import type { StepDataResolverRegistry } from "@execution/runtime/resolveStepData";

type ExecutionMode = "data" | "e2e";

export type RunCasesArgs = {
    mode: ExecutionMode;
    environment: string;
    scenarios: ExecutionScenario[];
    iterations: number;
    parallel?: number;
    schema?: string;
    source?: string;
    sheet?: string;
    verbose?: boolean;
    registry: ExecutorRegistry;
    dataRegistry: StepDataResolverRegistry;
    resolveOverrideStepData?: (
        scenario: ExecutionScenario
    ) => Record<string, unknown> | undefined;
};
