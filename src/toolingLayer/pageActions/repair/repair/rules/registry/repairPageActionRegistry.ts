// src/toolingLayer/pageActions/repair/repair/rules/registry/repairPageActionRegistry.ts

import { ensurePageActionRegistry } from "@toolingLayer/pageActions/generator/core/runtimeRegistry/ensurePageActionRegistry";
import {
    loadPageObjectManifestIndex,
    loadPageObjectManifestPage,
} from "@toolingLayer/pageActions/common";
import type { ActionRuntimeRegistryEntry } from "@toolingLayer/pageActions/generator/shared/types";
import type {
    RepairContext,
    RepairRuleResult,
} from "../../../types";

export function repairPageActionRegistry(
    _context: RepairContext
): RepairRuleResult {
    const pageObjectIndex = loadPageObjectManifestIndex();
    const entries: ActionRuntimeRegistryEntry[] = [];

    for (const relativePath of Object.values(pageObjectIndex.pages)) {
        const page = loadPageObjectManifestPage(relativePath);

        entries.push({
            pageKey: page.pageKey,
            scope: page.scope,
            actionName: `${page.scope.name
                .split("-")
                .map((part, index) =>
                    index === 0
                        ? part
                        : part.charAt(0).toUpperCase() + part.slice(1)
                )
                .join("")}Action`,
        });
    }

    const result = ensurePageActionRegistry({
        entries,
    });

    return {
        group: "registry",
        name: "repairPageActionRegistry",
        status:
            result.createdFiles > 0 || result.updatedFiles > 0
                ? "repaired"
                : "unchanged",
        changedFiles: result.createdFiles + result.updatedFiles,
        repairedItems: result.createdFiles + result.updatedFiles,
        warnings: 0,
        errors: 0,
        details: [],
    };
}
