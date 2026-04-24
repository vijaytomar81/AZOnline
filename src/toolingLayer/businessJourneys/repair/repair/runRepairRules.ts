// src/toolingLayer/businessJourneys/repair/repair/runRepairRules.ts

import type {
    RepairContext,
    RepairRuleResult,
} from "../types";
import { repairEnvironment } from "./rules/environment/repairEnvironment";
import { repairFrameworkFiles } from "./rules/framework/repairFrameworkFiles";
import { repairMissingJourneyTargets } from "./rules/journeys/repairMissingJourneyTargets";
import { repairJourneyExports } from "./rules/journeys/repairJourneyExports";
import { removeOrphanJourneyFiles } from "./rules/journeys/removeOrphanJourneyFiles";

export function runRepairRules(
    context: RepairContext
): RepairRuleResult[] {
    return [
        repairEnvironment(context),
        repairFrameworkFiles(context),
        repairMissingJourneyTargets(context),
        repairJourneyExports(context),
        removeOrphanJourneyFiles(context),
    ];
}
