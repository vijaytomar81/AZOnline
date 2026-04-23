// src/toolingLayer/pageActions/repair/repair/rules/manifest/removeOrphanManifestEntryFiles.ts

import fs from "node:fs";
import path from "node:path";
import {
    PAGE_ACTIONS_MANIFEST_DIR,
    PAGE_ACTIONS_MANIFEST_INDEX_FILE,
    toRepoRelative,
} from "@utils/paths";
import {
    loadPageActionManifestIndex,
} from "@toolingLayer/pageActions/common";
import type {
    RepairContext,
    RepairRuleResult,
} from "../../../types";

function collectManifestEntryFiles(dir: string): string[] {
    if (!fs.existsSync(dir)) {
        return [];
    }

    const files: string[] = [];

    for (const item of fs.readdirSync(dir)) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            files.push(...collectManifestEntryFiles(fullPath));
            continue;
        }

        if (
            item.endsWith(".action.json") &&
            fullPath !== PAGE_ACTIONS_MANIFEST_INDEX_FILE
        ) {
            files.push(fullPath);
        }
    }

    return files;
}

export function removeOrphanManifestEntryFiles(
    _context: RepairContext
): RepairRuleResult {
    const index = loadPageActionManifestIndex();
    const expectedFiles = new Set(
        Object.values(index.actions).map((relativePath) =>
            path.join(PAGE_ACTIONS_MANIFEST_DIR, relativePath)
        )
    );

    const actualFiles = collectManifestEntryFiles(PAGE_ACTIONS_MANIFEST_DIR);
    const orphanFiles = actualFiles.filter((filePath) => !expectedFiles.has(filePath));

    orphanFiles.forEach((filePath) => {
        fs.unlinkSync(filePath);
    });

    return {
        group: "manifest",
        name: "removeOrphanManifestEntryFiles",
        status: orphanFiles.length > 0 ? "repaired" : "unchanged",
        changedFiles: orphanFiles.length,
        repairedItems: orphanFiles.length,
        warnings: 0,
        errors: 0,
        details: orphanFiles.map((filePath) => ({
            message: `Removed ${toRepoRelative(filePath)}`,
        })),
    };
}
