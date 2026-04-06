// src/pageActionTools/page-action-validator/validate/pipeline/registry.ts

import type { ValidationRule } from "../types";
import { checkPageObjectToActionCoverage } from "../rules/coverage/checkPageObjectToActionCoverage";
import { checkEnvironment } from "../rules/environment/checkEnvironment";
import { checkActionFilesExist } from "../rules/files/checkActionFilesExist";
import { checkUnexpectedActionFiles } from "../rules/files/checkUnexpectedActionFiles";
import { checkActionFilePathConsistency } from "../rules/manifest/checkActionFilePathConsistency";
import { checkActionIndexPathConsistency } from "../rules/manifest/checkActionIndexPathConsistency";
import { checkActionKeyConsistency } from "../rules/manifest/checkActionKeyConsistency";
import { checkManifestEntriesExist } from "../rules/manifest/checkManifestEntriesExist";
import { checkManifestFiles } from "../rules/manifest/checkManifestFiles";
import { checkManifestIndexConsistency } from "../rules/manifest/checkManifestIndexConsistency";
import { checkActionsRootExports } from "../rules/registry/checkActionsRootExports";
import { checkPlatformIndexExports } from "../rules/registry/checkPlatformIndexExports";
import { checkRootPageActionsExports } from "../rules/registry/checkRootPageActionsExports";
import { checkActionFunctionName } from "../rules/hygiene/checkActionFunctionName";
import { checkDuplicateActionKeys } from "../rules/hygiene/checkDuplicateActionKeys";
import { checkDuplicateActionNames } from "../rules/hygiene/checkDuplicateActionNames";
import { checkGeneratedHeaderPath } from "../rules/hygiene/checkGeneratedHeaderPath";

export function getPageActionValidationRules(): ValidationRule[] {
    return [
        checkEnvironment,
        checkPageObjectToActionCoverage,
        checkActionFilesExist,
        checkUnexpectedActionFiles,
        checkManifestEntriesExist,
        checkManifestFiles,
        checkManifestIndexConsistency,
        checkActionKeyConsistency,
        checkActionFilePathConsistency,
        checkActionIndexPathConsistency,
        checkRootPageActionsExports,
        checkActionsRootExports,
        checkPlatformIndexExports,
        checkGeneratedHeaderPath,
        checkActionFunctionName,
        checkDuplicateActionKeys,
        checkDuplicateActionNames,
    ];
}
