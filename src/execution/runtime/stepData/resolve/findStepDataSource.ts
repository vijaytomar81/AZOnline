// src/execution/runtime/stepData/resolve/findStepDataSource.ts

import type { ScenarioStep } from "@execution/modes/e2e/scenario/types";
import type { StepDataResolverRegistry, StepDataSource } from "../types";
import { matchesStepDataSource } from "../utils/matchesStepDataSource";

export function findStepDataSource(args: {
    registry: StepDataResolverRegistry;
    journey: string;
    step: ScenarioStep;
}): StepDataSource | undefined {
    return args.registry.sources.find((item) =>
        matchesStepDataSource({
            step: args.step,
            journey: args.journey,
            source: item,
        })
    );
}
