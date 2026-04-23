// src/toolingLayer/pageActions/repair/repair/runRepairRules.ts

import type {
    RepairContext,
    RepairRuleResult,
} from "../types";

import { repairEnvironment } from "./rules/environment/repairEnvironment";
import { repairMissingActionFiles } from "./rules/actions/repairMissingActionFiles";
import { repairManifestIndex } from "./rules/manifest/repairManifestIndex";
import { repairManifestEntries } from "./rules/manifest/repairManifestEntries";
import { removeOrphanManifestEntryFiles } from "./rules/manifest/removeOrphanManifestEntryFiles";
import { repairRegistryIndexes } from "./rules/registry/repairRegistryIndexes";

export function runRepairRules(
    context: RepairContext
): RepairRuleResult[] {
    return [
        repairEnvironment(context),
        repairMissingActionFiles(context),
        repairManifestIndex(context),
        repairManifestEntries(context),
        removeOrphanManifestEntryFiles(context),
        repairRegistryIndexes(context),
    ];
}
