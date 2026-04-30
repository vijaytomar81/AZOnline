// src/toolingLayer/pageActions/validator/validate/buildRuleGroups.ts

import type { ValidationRuleGroup } from "./pipeline/types";
import { checkEnvironment } from "./rules/environment/checkEnvironment";
import { checkPageObjectManifestIndex } from "./rules/source/checkPageObjectManifestIndex";
import { checkPageObjectManifestEntries } from "./rules/source/checkPageObjectManifestEntries";
import { checkActionFilesExist } from "./rules/actions/checkActionFilesExist";
import { checkActionExports } from "./rules/actions/checkActionExports";
import { checkActionFileImports } from "./rules/actions/checkActionFileImports";
import { checkNoOrphanActionFiles } from "./rules/actions/checkNoOrphanActionFiles";
import { checkActionManifestFileExists } from "./rules/manifest/checkActionManifestFileExists";
import { checkPageActionManifestIndex } from "./rules/manifest/checkPageActionManifestIndex";
import { checkPageActionManifestEntries } from "./rules/manifest/checkPageActionManifestEntries";
import { checkManifestAgainstPageObjects } from "./rules/manifest/checkManifestAgainstPageObjects";
import { checkPageObjectsCovered } from "./rules/manifest/checkPageObjectsCovered";
import { checkActionFilePathMatchesManifest } from "./rules/manifest/checkActionFilePathMatchesManifest";
import { checkNoOrphanManifestEntryFiles } from "./rules/manifest/checkNoOrphanManifestEntryFiles";
import { checkPageActionIndexes } from "./rules/registry/checkPageActionIndexes";
import { checkPageActionRegistry } from "./rules/registry/checkPageActionRegistry";
import { checkRuntimeContract } from "./rules/runtime/checkRuntimeContract";

export function buildRuleGroups(): ValidationRuleGroup[] {
    return [
        {
            id: "environment",
            checks: [checkEnvironment],
        },
        {
            id: "source",
            checks: [
                checkPageObjectManifestIndex,
                checkPageObjectManifestEntries,
            ],
        },
        {
            id: "actions",
            checks: [
                checkActionFilesExist,
                checkActionExports,
                checkActionFileImports,
                checkNoOrphanActionFiles,
            ],
        },
        {
            id: "manifest",
            checks: [
                checkPageActionManifestIndex,
                checkActionManifestFileExists,
                checkPageActionManifestEntries,
                checkActionFilePathMatchesManifest,
                checkManifestAgainstPageObjects,
                checkPageObjectsCovered,
                checkNoOrphanManifestEntryFiles,
            ],
        },
        {
            id: "metadataExports",
            checks: [checkPageActionIndexes],
        },
        {
            id: "registry",
            checks: [checkPageActionRegistry],
        },
        {
            id: "runtime",
            checks: [checkRuntimeContract],
        },
    ];
}
