// src/businessJourneys/journeys/athena/motor/newBusiness/buildAthenaMotorNewBusinessSteps.ts

import type { JourneyStep } from "@businessJourneys/shared/types";
import { buildDirectEntrySteps } from "./entryPoints/buildDirectEntrySteps";

export function buildAthenaMotorNewBusinessSteps(args: {
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
