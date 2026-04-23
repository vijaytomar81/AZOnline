// src/toolingLayer/pageActions/validator/validate/runPageActionValidator.ts

import {
    PAGE_ACTIONS_ACTIONS_DIR,
    PAGE_ACTIONS_DIR,
    PAGE_ACTIONS_MANIFEST_DIR,
    PAGE_MANIFEST_DIR,
    toRepoRelative,
} from "@utils/paths";
import type { ValidatorCliOptions } from "../types";
import { buildRuleGroups } from "./buildRuleGroups";
import {
    printRuleExecution,
    printValidatorEnvironment,
    printValidatorHeader,
    printValidatorSummary,
} from "./report";
import { runValidationPipeline } from "./pipeline/runValidationPipeline";

export function runPageActionValidator(
    options: ValidatorCliOptions
): void {
    printValidatorHeader();

    printValidatorEnvironment([
        ["pageObjectsManifest", toRepoRelative(PAGE_MANIFEST_DIR)],
        ["pageActionsDir", toRepoRelative(PAGE_ACTIONS_ACTIONS_DIR)],
        ["pageRegistryDir", toRepoRelative(PAGE_ACTIONS_DIR)],
        ["manifestFile", toRepoRelative(PAGE_ACTIONS_MANIFEST_DIR)],
        ["strict", options.strict],
        ["verbose", options.verbose],
    ]);

    const result = runValidationPipeline(buildRuleGroups());

    printRuleExecution(result);
    printValidatorSummary(result);

    process.exit(result.totalErrors > 0 ? 1 : 0);
}
