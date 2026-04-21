// src/toolingLayer/pageActions/validator/validate/rules/manifest/checkNoOrphanManifestEntryFiles.ts

import fs from "node:fs";
import path from "node:path";
import {
    PAGE_ACTIONS_MANIFEST_DIR,
    PAGE_ACTIONS_MANIFEST_INDEX_FILE,
    toRepoRelative,
} from "@utils/paths";
import type { ValidationCheckResult, ValidationNode } from "../../pipeline/types";
import { loadPageActionManifestIndex } from "../../../shared/loadPageActionManifestIndex";

function collectManifestFiles(dir: string): string[] {
    if (!fs.existsSync(dir)) {
        return [];
    }

    const files: string[] = [];

    for (const item of fs.readdirSync(dir)) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            files.push(...collectManifestFiles(fullPath));
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

export function checkNoOrphanManifestEntryFiles(): ValidationCheckResult {
    try {
        const index = loadPageActionManifestIndex();
        const expectedFiles = new Set(
            Object.values(index.actions).map((relativePath) =>
                path.join(PAGE_ACTIONS_MANIFEST_DIR, relativePath)
            )
        );

        const actualFiles = collectManifestFiles(PAGE_ACTIONS_MANIFEST_DIR);
        const orphanFiles = actualFiles.filter((filePath) => !expectedFiles.has(filePath));

        const nodes: ValidationNode[] = orphanFiles.map((filePath) => ({
            severity: "warning",
            title: toRepoRelative(filePath),
            summary: "orphan manifest entry file",
        }));

        return {
            id: "checkNoOrphanManifestEntryFiles",
            severity: nodes.length === 0 ? "success" : "warning",
            summary: nodes.length === 0 ? "no issues" : `${nodes.length} orphan file(s)`,
            nodes,
        };
    } catch {
        return {
            id: "checkNoOrphanManifestEntryFiles",
            severity: "error",
            summary: "unable to inspect manifest entry files",
        };
    }
}
