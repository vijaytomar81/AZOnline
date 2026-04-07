// src/businessJourneys/journeys/athena/home/newbusiness/buildAthenaHomeNewbusinessSteps.ts

import type { JourneyStep } from "@businessJourneys/shared/types";
import { buildDirectEntrySteps } from "./entryPoints/buildDirectEntrySteps";

export function buildAthenaHomeNewbusinessSteps(args: {
    entryPoint: string;
}): JourneyStep[] {
    const entrySteps = buildDirectEntrySteps();

    return [
        ...entrySteps,
        // TODO: add shared/common downstream steps
        // TODO: review athena continuation steps
        // TODO: review partner-specific navigation steps
    ];
}
