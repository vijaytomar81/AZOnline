// src/pageActionTools/page-action-validator/validate/pipeline/registry.ts

import type { ValidationRule } from "../types";
import { checkPageObjectToActionCoverage } from "../rules/coverage/checkPageObjectToActionCoverage";
import { checkEnvironment } from "../rules/environment/checkEnvironment";
import { checkActionFilesExist } from "../rules/files/checkActionFilesExist";
import { checkUnexpectedActionFiles } from "../rules/files/checkUnexpectedActionFiles";
import { checkActionKeyConsistency } from "../rules/manifest/checkActionKeyConsistency";
import { checkManifestEntriesExist } from "../rules/manifest/checkManifestEntriesExist";
import { checkManifestFiles } from "../rules/manifest/checkManifestFiles";
import { checkIndexExports } from "../rules/registry/checkIndexExports";
import { checkActionFunctionName } from "../rules/hygiene/checkActionFunctionName";
import { checkGeneratedHeaderPath } from "../rules/hygiene/checkGeneratedHeaderPath";

export function getPageActionValidationRules(): ValidationRule[] {
    return [
        checkEnvironment,
        checkPageObjectToActionCoverage,
        checkActionFilesExist,
        checkUnexpectedActionFiles,
        checkManifestEntriesExist,
        checkManifestFiles,
        checkActionKeyConsistency,
        checkIndexExports,
        checkGeneratedHeaderPath,
        checkActionFunctionName,
    ];
}
