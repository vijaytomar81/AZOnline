// src/toolingLayer/pageObjects/common/manifest/removeMissingPageManifestEntries.ts

import fs from "node:fs";
import { ensureDir } from "@utils/fs";
import path from "node:path";

export function removeMissingPageManifestEntries(
    manifestPagesDir: string,
    validPageKeys: string[]
): number {
    ensureDir(manifestPagesDir);
    const valid = new Set(validPageKeys);
    let removed = 0;

    for (const file of fs.readdirSync(manifestPagesDir)) {
        if (!file.endsWith(".json")) continue;

        const pageKey = file.slice(0, -5);
        if (!valid.has(pageKey)) {
            fs.unlinkSync(path.join(manifestPagesDir, file));
            removed++;
        }
    }

    return removed;
}
