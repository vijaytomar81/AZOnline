// src/pageActionTools/page-action-repair/repair/pipeline/registry.ts

import type { RepairRule } from "../types";
import { repairMissingActionFiles } from "../rules/files/repairMissingActionFiles";
import { repairActionFilePathConsistency } from "../rules/manifest/repairActionFilePathConsistency";
import { repairActionIndexPathConsistency } from "../rules/manifest/repairActionIndexPathConsistency";
import { repairActionKeyConsistency } from "../rules/manifest/repairActionKeyConsistency";
import { repairManifestEntries } from "../rules/manifest/repairManifestEntries";
import { repairManifestIndexConsistency } from "../rules/manifest/repairManifestIndexConsistency";
import { repairActionsRootExports } from "../rules/registry/repairActionsRootExports";
import { repairPlatformIndexExports } from "../rules/registry/repairPlatformIndexExports";
import { repairRootPageActionsExports } from "../rules/registry/repairRootPageActionsExports";
import { repairGeneratedHeaderPath } from "../rules/hygiene/repairGeneratedHeaderPath";

export function getPageActionRepairRules(): RepairRule[] {
    return [
        repairMissingActionFiles,
        repairManifestEntries,
        repairManifestIndexConsistency,
        repairActionKeyConsistency,
        repairActionFilePathConsistency,
        repairActionIndexPathConsistency,
        repairRootPageActionsExports,
        repairActionsRootExports,
        repairPlatformIndexExports,
        repairGeneratedHeaderPath,
    ];
}
