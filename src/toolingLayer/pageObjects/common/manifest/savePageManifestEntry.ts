// src/toolingLayer/pageObjects/common/manifest/savePageManifestEntry.ts

import fs from "node:fs";
import path from "node:path";

import { ensureDir } from "@utils/fs";
import type { PageManifestEntry } from "./types";

export function savePageManifestEntry(
    filePath: string,
    entry: PageManifestEntry
): boolean {
    ensureDir(path.dirname(filePath));

    const nextText = JSON.stringify(entry, null, 2);

    if (fs.existsSync(filePath)) {
        const currentText = fs.readFileSync(filePath, "utf8");
        if (currentText === nextText) {
            return false;
        }
    }

    fs.writeFileSync(filePath, nextText, "utf8");
    return true;
}
