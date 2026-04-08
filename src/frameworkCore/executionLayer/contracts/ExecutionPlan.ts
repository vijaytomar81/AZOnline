// src/frameworkCore/executionLayer/contracts/ExecutionPlan.ts

import type { ExecutionScenario } from "./ExecutionScenario";

export type ExecutionMode = "data" | "e2e";

export type ExecutionPlan = {
    mode: ExecutionMode;
    environment: string;
    scenarios: ExecutionScenario[];
    iterations: number;
    parallel?: number;
    schema?: string;
    source?: string;
    sheet?: string;
    verbose?: boolean;
};
