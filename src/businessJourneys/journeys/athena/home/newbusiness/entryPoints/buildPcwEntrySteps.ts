// src/businessJourneys/journeys/athena/home/newbusiness/entryPoints/buildPcwEntrySteps.ts

import type { JourneyStep } from "@businessJourneys/shared/types";
import { stepOpenStartUrl } from "../steps/common/stepOpenStartUrl";

export function buildPcwEntrySteps(): JourneyStep[] {
    return [
        stepOpenStartUrl,
        // TODO: review partner-entry steps before Athena handoff
    ];
}
