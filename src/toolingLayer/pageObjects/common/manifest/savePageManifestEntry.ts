// src/toolingLayer/pageObjects/common/manifest/savePageManifestEntry.ts

import fs from "node:fs";
import path from "node:path";
import { ensureDir } from "@utils/fs";
import type { PageManifestEntry } from "./types";

export function savePageManifestEntry(
    filePath: string,
    entry: PageManifestEntry
): void {
    ensureDir(path.dirname(filePath));
    fs.writeFileSync(filePath, JSON.stringify(entry, null, 2), "utf8");
}
