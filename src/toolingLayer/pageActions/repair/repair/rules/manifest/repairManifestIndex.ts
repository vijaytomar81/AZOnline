// src/toolingLayer/pageActions/repair/repair/rules/manifest/repairManifestIndex.ts

import { PAGE_ACTIONS_MANIFEST_INDEX_FILE } from "@utils/paths";
import {
    loadPageObjectManifestIndex,
    writeIfChanged,
} from "@toolingLayer/pageActions/common";

import type {
    RepairContext,
    RepairRuleResult,
} from "../../../types";

export function repairManifestIndex(
    _context: RepairContext
): RepairRuleResult {
    const sourceIndex = loadPageObjectManifestIndex();

    const actions: Record<string, string> = {};

    Object.entries(sourceIndex.pages).forEach(
        ([pageKey, relativePath]) => {
            actions[pageKey] = relativePath.replace(
                ".json",
                ".action.json"
            );
        }
    );

    const content = JSON.stringify(
        {
            version: 1,
            generatedAt: new Date().toISOString(),
            actions,
        },
        null,
        2
    );

    const write = writeIfChanged(
        PAGE_ACTIONS_MANIFEST_INDEX_FILE,
        content
    );

    return {
        group: "manifest",
        name: "repairManifestIndex",
        status: write.changed ? "repaired" : "unchanged",
        changedFiles: write.changed ? 1 : 0,
        repairedItems: Object.keys(actions).length,
        warnings: 0,
        errors: 0,
        details: [],
    };
}
