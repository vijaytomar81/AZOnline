// src/frameworkCore/executionLayer/contracts/ExecutionPlan.ts

import type { EnvKey } from "@configLayer/environments";
import type { ExecutionMode } from "@configLayer/core/executionModes";
import type { ExecutionScenario } from "./ExecutionScenario";

export type ExecutionPlan = {
    mode: ExecutionMode;
    environment: EnvKey;
    scenarios: ExecutionScenario[];
    iterations: number;
    parallel?: number;
    schema?: string;
    source?: string;
    sheet?: string;
    verbose?: boolean;
};
