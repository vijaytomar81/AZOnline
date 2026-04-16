// src/toolingLayer/pageObjects/common/manifest/loadPageManifest.ts

import path from "node:path";

import { loadManifestIndex } from "./loadManifestIndex";
import { loadPageManifestEntry } from "./loadPageManifestEntry";
import {
    getManifestIndexFile,
    normalizeManifestRoot,
} from "./manifestPaths";
import type { PageObjectsManifest } from "./types";

function emptyManifest(): PageObjectsManifest {
    return { version: 1, generatedAt: new Date().toISOString(), pages: {} };
}

export function loadPageManifest(inputPath: string): PageObjectsManifest {
    const manifestRoot = normalizeManifestRoot(inputPath);
    const index = loadManifestIndex(getManifestIndexFile(inputPath));
    const pages: Record<string, PageObjectsManifest["pages"][string]> = {};

    for (const [pageKey, fileName] of Object.entries(index.pages)) {
        const entry = loadPageManifestEntry(path.join(manifestRoot, fileName));
        if (entry) {
            pages[pageKey] = entry;
        }
    }

    if (!index.generatedAt) {
        return emptyManifest();
    }

    return {
        version: 1,
        generatedAt: index.generatedAt,
        pages,
    };
}
