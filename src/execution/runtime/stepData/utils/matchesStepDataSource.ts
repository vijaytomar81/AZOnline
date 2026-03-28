// src/execution/runtime/stepData/utils/matchesStepDataSource.ts

import type { ScenarioStep } from "@execution/modes/e2e/scenario/types";
import type { StepDataSource } from "../types";
import { normalizeResolverKey } from "./normalizeResolverKey";

export function matchesStepDataSource(args: {
    step: ScenarioStep;
    journey: string;
    source: StepDataSource;
}): boolean {
    const { step, journey, source } = args;

    if (
        normalizeResolverKey(step.action) !==
        normalizeResolverKey(source.action)
    ) {
        return false;
    }

    if (
        source.journey &&
        normalizeResolverKey(journey) !== normalizeResolverKey(source.journey)
    ) {
        return false;
    }

    if (
        source.subType &&
        normalizeResolverKey(step.subType) !==
            normalizeResolverKey(source.subType)
    ) {
        return false;
    }

    return true;
}
