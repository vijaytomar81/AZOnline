// src/toolingLayer/businessJourneys/validator/validate/buildRuleGroups.ts

import type { ValidationRuleGroup } from "./pipeline/types";
import { checkEnvironment } from "./rules/environment/checkEnvironment";
import { checkFrameworkFilesExist } from "./rules/environment/checkFrameworkFilesExist";
import { checkRuntimeFilesExist } from "./rules/environment/checkRuntimeFilesExist";
import { checkJourneyPageActionReferences } from "./rules/source/checkJourneyPageActionReferences";
import { checkJourneyUsesPageActionsRegistry } from "./rules/source/checkJourneyUsesPageActionsRegistry";
import { checkJourneyFilesExist } from "./rules/journeys/checkJourneyFilesExist";
import { checkJourneyRunnerExports } from "./rules/journeys/checkJourneyRunnerExports";
import { checkJourneyTargetsCovered } from "./rules/journeys/checkJourneyTargetsCovered";
import { checkNoOrphanJourneyFiles } from "./rules/journeys/checkNoOrphanJourneyFiles";

export function buildRuleGroups(): ValidationRuleGroup[] {
    return [
        {
            id: "environment",
            checks: [
                checkEnvironment,
                checkFrameworkFilesExist,
                checkRuntimeFilesExist,
            ],
        },
        {
            id: "source",
            checks: [
                checkJourneyUsesPageActionsRegistry,
                checkJourneyPageActionReferences,
            ],
        },
        {
            id: "journeys",
            checks: [
                checkJourneyFilesExist,
                checkJourneyRunnerExports,
                checkJourneyTargetsCovered,
                checkNoOrphanJourneyFiles,
            ],
        },
    ];
}
