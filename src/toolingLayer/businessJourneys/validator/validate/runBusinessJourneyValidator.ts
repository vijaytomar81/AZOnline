// src/toolingLayer/businessJourneys/validator/validate/runBusinessJourneyValidator.ts

import {
    BUSINESS_JOURNEYS_DIR,
    PAGE_ACTIONS_REGISTRY_DIR,
    toRepoRelative,
} from "@utils/paths";
import { buildRuleGroups } from "./buildRuleGroups";
import { runValidationPipeline } from "./pipeline/runValidationPipeline";
import {
    printBusinessJourneyValidatorEnvironment,
    printBusinessJourneyValidatorHeader,
    printRuleExecution,
    printValidatorSummary,
} from "./report";

export function runBusinessJourneyValidator(args: {
    strict?: boolean;
    verbose?: boolean;
} = {}): number {
    const strict = !!args.strict;
    const verbose = !!args.verbose;

    printBusinessJourneyValidatorHeader();

    printBusinessJourneyValidatorEnvironment([
        ["businessJourneysDir", toRepoRelative(BUSINESS_JOURNEYS_DIR)],
        ["pageActionsRegistry", toRepoRelative(PAGE_ACTIONS_REGISTRY_DIR)],
        ["strict", strict],
        ["verbose", verbose],
    ]);

    const result = runValidationPipeline(buildRuleGroups());

    printRuleExecution(result);
    printValidatorSummary(result);

    return result.totalErrors > 0 ? 1 : 0;
}
