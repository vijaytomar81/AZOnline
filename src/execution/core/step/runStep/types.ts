// src/execution/core/step/runStep/types.ts

import type { ScenarioStep } from "@execution/modes/e2e/scenario/types";
import type { ExecutionContext } from "@execution/core/context/executionContext.types";
import type { ExecutorRegistry } from "@execution/core/registry";
import type { StepDataResolverRegistry } from "@execution/runtime/resolveStepData";

export type RunStepArgs = {
    context: ExecutionContext;
    step: ScenarioStep;
    registry: ExecutorRegistry;
    dataRegistry: StepDataResolverRegistry;
    logScope: string;
    overrideStepData?: Record<string, unknown>;
    mode?: "data" | "e2e";
};
