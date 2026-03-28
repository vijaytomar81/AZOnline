// src/execution/runtime/stepData/registerStepDataSource.ts

import type { StepDataResolverRegistry, StepDataSource } from "./types";

export function registerStepDataSource(
    registry: StepDataResolverRegistry,
    source: StepDataSource
): void {
    registry.sources.push(source);
}
