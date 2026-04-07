// src/businessJourneys/journeys/goco/motor/newBusiness/buildGocoMotorNewBusinessSteps.ts

import type { JourneyStep } from "@businessJourneys/shared/types";
import { buildPcwEntrySteps } from "./entryPoints/buildPcwEntrySteps";

export function buildGocoMotorNewBusinessSteps(args: {
    entryPoint: string;
}): JourneyStep[] {
    const entrySteps = buildPcwEntrySteps();

    return [
        ...entrySteps,
        // TODO: add shared/common downstream steps
        // TODO: review athena continuation steps
        // TODO: review partner-specific navigation steps
    ];
}
