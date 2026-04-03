// src/pageActionTools/page-action-repair/repair/pipeline/registry.ts

import type { RepairRule } from "../types";
import { repairMissingActionFiles } from "../rules/files/repairMissingActionFiles";
import { repairActionKeyConsistency } from "../rules/manifest/repairActionKeyConsistency";
import { repairManifestEntries } from "../rules/manifest/repairManifestEntries";
import { repairIndexExports } from "../rules/registry/repairIndexExports";
import { repairGeneratedHeaderPath } from "../rules/hygiene/repairGeneratedHeaderPath";

export function getPageActionRepairRules(): RepairRule[] {
    return [
        repairMissingActionFiles,
        repairManifestEntries,
        repairActionKeyConsistency,
        repairIndexExports,
        repairGeneratedHeaderPath,
    ];
}
