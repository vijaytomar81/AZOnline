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
import { repairPageActionMetadataExports } from "./rules/registry/repairRegistryIndexes";
import { repairPageActionRegistry } from "./rules/registry/repairPageActionRegistry";

export function runRepairRules(
    context: RepairContext
): RepairRuleResult[] {
    return [
        repairEnvironment(context),
        repairMissingActionFiles(context),
        repairManifestIndex(context),
        repairManifestEntries(context),
        removeOrphanManifestEntryFiles(context),
        repairPageActionMetadataExports(context),
        repairPageActionRegistry(context),
    ];
}
