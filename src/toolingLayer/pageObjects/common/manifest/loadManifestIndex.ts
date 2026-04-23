// src/toolingLayer/pageObjects/common/manifest/loadManifestIndex.ts

import fs from "node:fs";
import type { ManifestIndex } from "./types";

function emptyIndex(): ManifestIndex {
    return { version: 1, generatedAt: new Date().toISOString(), pages: {} };
}

export function loadManifestIndex(indexFile: string): ManifestIndex {
    if (!fs.existsSync(indexFile)) return emptyIndex();

    try {
        const parsed = JSON.parse(
            fs.readFileSync(indexFile, "utf8")
        ) as Partial<ManifestIndex>;

        return {
            version: 1,
            generatedAt:
                typeof parsed.generatedAt === "string"
                    ? parsed.generatedAt
                    : new Date().toISOString(),
            pages:
                parsed.pages && typeof parsed.pages === "object"
                    ? (parsed.pages as Record<string, string>)
                    : {},
        };
    } catch {
        return emptyIndex();
    }
}
