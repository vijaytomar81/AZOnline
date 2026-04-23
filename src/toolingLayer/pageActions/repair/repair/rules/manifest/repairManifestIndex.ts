// src/toolingLayer/pageActions/repair/repair/rules/manifest/repairManifestIndex.ts

import {
    PAGE_ACTIONS_MANIFEST_INDEX_FILE,
} from "@utils/paths";
import {
    loadPageObjectManifestIndex,
    readTextIfExists,
    writeIfChanged,
} from "@toolingLayer/pageActions/common";

import type {
    RepairContext,
    RepairRuleResult,
} from "../../../types";

type ExistingManifestIndex = {
    version?: number;
    generatedAt?: string;
    actions?: Record<string, string>;
};

function countChangedEntries(
    currentActions: Record<string, string>,
    nextActions: Record<string, string>
): number {
    const keys = new Set([
        ...Object.keys(currentActions),
        ...Object.keys(nextActions),
    ]);

    let changed = 0;

    keys.forEach((key) => {
        if (currentActions[key] !== nextActions[key]) {
            changed++;
        }
    });

    return changed;
}

export function repairManifestIndex(
    _context: RepairContext
): RepairRuleResult {
    const sourceIndex = loadPageObjectManifestIndex();

    const nextActions: Record<string, string> = {};

    Object.entries(sourceIndex.pages).forEach(
        ([pageKey, relativePath]) => {
            nextActions[pageKey] = relativePath.replace(
                /\.json$/,
                ".action.json"
            );
        }
    );

    const currentText = readTextIfExists(
        PAGE_ACTIONS_MANIFEST_INDEX_FILE
    );

    let current: ExistingManifestIndex | null = null;

    if (currentText) {
        try {
            current = JSON.parse(currentText) as ExistingManifestIndex;
        } catch {
            current = null;
        }
    }

    const currentActions = current?.actions ?? {};
    const repairedItems = countChangedEntries(
        currentActions,
        nextActions
    );

    const content = JSON.stringify(
        {
            version: current?.version ?? 1,
            generatedAt:
                current?.generatedAt ??
                new Date().toISOString(),
            actions: nextActions,
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
        repairedItems: write.changed ? repairedItems : 0,
        warnings: 0,
        errors: 0,
        details: [],
    };
}
