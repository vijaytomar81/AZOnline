// src/businessJourneys/journeys/athena/motor/newbusiness/entryPoints/buildPcwToolEntrySteps.ts

import type { JourneyStep } from "@businessJourneys/shared/types";
import { stepOpenStartUrl } from "../steps/common/stepOpenStartUrl";

export function buildPcwToolEntrySteps(): JourneyStep[] {
    return [
        stepOpenStartUrl,
        // TODO: review pcw-tool entry preparation steps
    ];
}
