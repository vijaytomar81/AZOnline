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

export function repairManifestIndex(
    _context: RepairContext
): RepairRuleResult {
    const sourceIndex = loadPageObjectManifestIndex();

    const actions: Record<string, string> = {};

    Object.entries(sourceIndex.pages).forEach(
        ([pageKey, relativePath]) => {
            actions[pageKey] = relativePath.replace(
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

    const actionsChanged =
        JSON.stringify(current?.actions ?? {}) !==
        JSON.stringify(actions);

    const content = JSON.stringify(
        {
            version: current?.version ?? 1,
            generatedAt: actionsChanged
                ? new Date().toISOString()
                : current?.generatedAt ?? new Date().toISOString(),
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
        repairedItems: actionsChanged ? Object.keys(actions).length : 0,
        warnings: 0,
        errors: 0,
        details: [],
    };
}
