// src/toolingLayer/pageActions/repair/repair/rules/manifest/repairManifestCoverage.ts

import { PAGE_ACTIONS_MANIFEST_INDEX_FILE } from "@utils/paths";
import {
    loadPageObjectManifestIndex,
    loadPageActionManifestIndex,
    writeIfChanged,
} from "@toolingLayer/pageActions/common";
import type {
    RepairContext,
    RepairRuleResult,
} from "../../../types";

export function repairManifestCoverage(
    _context: RepairContext
): RepairRuleResult {
    const pageIndex = loadPageObjectManifestIndex();
    const actionIndex = loadPageActionManifestIndex();

    const nextActions: Record<string, string> = {};

    Object.entries(pageIndex.pages).forEach(([pageKey, relativePath]) => {
        nextActions[pageKey] = relativePath.replace(/\.json$/, ".action.json");
    });

    const write = writeIfChanged(
        PAGE_ACTIONS_MANIFEST_INDEX_FILE,
        JSON.stringify(
            {
                version: actionIndex.version ?? 1,
                generatedAt: new Date().toISOString(),
                actions: nextActions,
            },
            null,
            2
        )
    );

    const repairedKeys = Object.keys(nextActions).filter(
        (pageKey) => actionIndex.actions[pageKey] !== nextActions[pageKey]
    );

    return {
        group: "manifest",
        name: "repairManifestCoverage",
        status: write.changed ? "repaired" : "unchanged",
        changedFiles: write.changed ? 1 : 0,
        repairedItems: repairedKeys.length,
        warnings: 0,
        errors: 0,
        details: repairedKeys.map((pageKey) => ({
            message: `Covered ${pageKey}`,
        })),
    };
}
