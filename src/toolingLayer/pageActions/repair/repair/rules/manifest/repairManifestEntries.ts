// src/toolingLayer/pageActions/repair/repair/rules/manifest/repairManifestEntries.ts

import path from "node:path";
import {
    PAGE_ACTIONS_MANIFEST_DIR,
} from "@utils/paths";
import {
    writeIfChanged,
    loadPageObjectManifestIndex,
    loadPageObjectManifestPage,
    buildExpectedActionState,
} from "@toolingLayer/pageActions/common";

import type {
    RepairContext,
    RepairRuleResult,
} from "../../../types";

export function repairManifestEntries(
    _context: RepairContext
): RepairRuleResult {
    const index = loadPageObjectManifestIndex();

    let changedFiles = 0;
    let repairedItems = 0;

    Object.values(index.pages).forEach((relativePath) => {
        const page = loadPageObjectManifestPage(relativePath);
        const expected = buildExpectedActionState(page);

        const manifestFilePath = path.join(
            PAGE_ACTIONS_MANIFEST_DIR,
            expected.manifestEntryRelativePath
        );

        const write = writeIfChanged(
            manifestFilePath,
            JSON.stringify(expected.manifestEntry, null, 2)
        );

        if (write.changed) {
            changedFiles++;
            repairedItems++;
        }
    });

    return {
        group: "manifest",
        name: "repairManifestEntries",
        status: changedFiles > 0 ? "repaired" : "unchanged",
        changedFiles,
        repairedItems,
        warnings: 0,
        errors: 0,
        details: [],
    };
}
