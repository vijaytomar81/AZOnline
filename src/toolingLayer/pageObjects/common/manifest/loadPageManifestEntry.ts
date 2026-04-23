// src/toolingLayer/pageObjects/common/manifest/loadPageManifestEntry.ts

import fs from "node:fs";
import type { PageManifestEntry } from "./types";

export function loadPageManifestEntry(filePath: string): PageManifestEntry | null {
    if (!fs.existsSync(filePath)) return null;

    try {
        return JSON.parse(fs.readFileSync(filePath, "utf8")) as PageManifestEntry;
    } catch {
        return null;
    }
}
