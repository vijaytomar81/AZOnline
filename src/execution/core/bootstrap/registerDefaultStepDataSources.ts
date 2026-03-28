// src/execution/core/bootstrap/registerDefaultStepDataSources.ts

import {
    registerStepDataSource,
    type StepDataResolverRegistry,
} from "@execution/runtime/resolveStepData";

export function registerDefaultStepDataSources(
    stepDataRegistry: StepDataResolverRegistry
): void {
    registerStepDataSource(stepDataRegistry, {
        action: "NewBusiness",
        journey: "Direct",
        sheetName: "FlowNB",
        schemaName: "direct",
    });
}
