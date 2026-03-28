// src/execution/core/registry/types.ts

import type { ScenarioStep } from "@execution/modes/e2e/scenario/types";
import type { ExecutionContext } from "@execution/core/context/executionContext.types";

export type StepExecutorArgs = {
    context: ExecutionContext;
    step: ScenarioStep;
    stepData?: Record<string, unknown>;
};

export type StepExecutor = (args: StepExecutorArgs) => Promise<void>;

export type ExecutorRegistry = Record<string, StepExecutor>;
