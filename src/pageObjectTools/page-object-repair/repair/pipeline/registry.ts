// src/pageObjectTools/page-object-repair/repair/pipeline/registry.ts

import type { RepairRule } from "./types";
import { repairManifest } from "../rules/manifest/repairManifest";
import { repairAliasesToPageObject } from "../rules/pageChain/repairAliasesToPageObject";
import { repairElementsToGeneratedAliases } from "../rules/pageChain/repairElementsToGeneratedAliases";
import { repairGeneratedAliasesToAliases } from "../rules/pageChain/repairGeneratedAliasesToAliases";
import { repairIndexExports } from "../rules/registry/repairIndexExports";
import { repairPageManager } from "../rules/registry/repairPageManager";

/**
 * Single control point for repair order.
 * Add/remove/reorder repair rules only here.
 */
export const REPAIR_RULES: RepairRule[] = [
    repairElementsToGeneratedAliases,
    repairGeneratedAliasesToAliases,
    repairAliasesToPageObject,
    repairManifest,
    repairIndexExports,
    repairPageManager,
];