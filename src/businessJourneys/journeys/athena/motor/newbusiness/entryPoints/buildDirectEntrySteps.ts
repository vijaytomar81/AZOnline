// src/businessJourneys/journeys/athena/motor/newBusiness/entryPoints/buildDirectEntrySteps.ts

import type { JourneyStep } from "@businessJourneys/shared/types";
import { stepOpenStartUrl } from "../steps/common/stepOpenStartUrl";

export function buildDirectEntrySteps(): JourneyStep[] {
    return [
        stepOpenStartUrl,
        // TODO: review direct-entry pre-navigation steps
    ];
}
