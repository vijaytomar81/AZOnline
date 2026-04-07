// src/tools/pageObjects/validator/validate/pipeline/registry.ts

import type { ValidationRule } from "./types";

import { checkEnvironment } from "../rules/environment/checkEnvironment";
import { checkPageMapSchema } from "../rules/source/checkPageMapSchema";
import { checkPageMapKeys } from "../rules/source/checkPageMapKeys";
import { checkPageMapReadiness } from "../rules/source/checkPageMapReadiness";
import { checkGeneratedFilesExist } from "../rules/outputs/checkGeneratedFilesExist";
// import { checkPageMapToElements } from "../rules/pageChain/checkPageMapToElements";
import { checkElementsToGeneratedAliases } from "../rules/pageChain/checkElementsToGeneratedAliases";
import { checkGeneratedToBusinessAliases } from "../rules/pageChain/checkGeneratedToBusinessAliases";
import { checkBusinessAliasesToPageObject } from "../rules/pageChain/checkBusinessAliasesToPageObject";
import { checkPageObjectStructure } from "../rules/pageChain/checkPageObjectStructure";
import { checkPageObjectReadiness } from "../rules/pageChain/checkPageObjectReadiness";
import { checkPageMeta } from "../rules/pageChain/checkPageMeta";
import { checkManifestAgainstPageMap } from "../rules/manifest/checkManifestAgainstPageMap";
import { checkManifestFiles } from "../rules/manifest/checkManifestFiles";
import { checkIndexExports } from "../rules/registry/checkIndexExports";
import { checkPageManager } from "../rules/registry/checkPageManager";
import { checkModuleHygiene } from "../rules/hygiene/checkModuleHygiene";
import { checkNamingConventions } from "../rules/conventions/checkNamingConventions";

export const VALIDATION_RULES: ValidationRule[] = [
    checkEnvironment,
    checkPageMapSchema,
    checkPageMapKeys,
    checkPageMapReadiness,
    checkGeneratedFilesExist,
    // checkPageMapToElements,
    checkElementsToGeneratedAliases,
    checkGeneratedToBusinessAliases,
    checkBusinessAliasesToPageObject,
    checkPageObjectStructure,
    checkPageObjectReadiness,
    checkPageMeta,
    checkManifestAgainstPageMap,
    checkManifestFiles,
    checkIndexExports,
    checkPageManager,
    checkModuleHygiene,
    checkNamingConventions,
];