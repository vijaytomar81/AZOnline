// src/toolingLayer/pageObjects/common/manifest/removeMissingPageManifestEntries.ts

import fs from "node:fs";
import path from "node:path";

import { ensureDir } from "@utils/fs";
import {
    getManifestEntryRelativePath,
    normalizeManifestRoot,
    toManifestRelativePath,
} from "./manifestPaths";

function collectJsonFiles(dir: string): string[] {
    const collected: string[] = [];

    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            collected.push(...collectJsonFiles(fullPath));
            continue;
        }

        if (entry.isFile() && entry.name.endsWith(".json")) {
            collected.push(fullPath);
        }
    }

    return collected;
}

function removeEmptyDirs(dir: string, rootDir: string): void {
    if (dir === rootDir) {
        return;
    }

    if (fs.existsSync(dir) && fs.readdirSync(dir).length === 0) {
        fs.rmdirSync(dir);
        removeEmptyDirs(path.dirname(dir), rootDir);
    }
}

export function removeMissingPageManifestEntries(
    manifestRoot: string,
    validPageKeys: string[]
): number {
    const rootDir = normalizeManifestRoot(manifestRoot);
    ensureDir(rootDir);

    const validFiles = new Set(
        validPageKeys.map((pageKey) => getManifestEntryRelativePath(pageKey))
    );

    let removed = 0;

    for (const filePath of collectJsonFiles(rootDir)) {
        const relativePath = toManifestRelativePath(rootDir, filePath);

        if (relativePath === "index.json") {
            continue;
        }

        if (!validFiles.has(relativePath)) {
            fs.unlinkSync(filePath);
            removeEmptyDirs(path.dirname(filePath), rootDir);
            removed++;
        }
    }

    return removed;
}
