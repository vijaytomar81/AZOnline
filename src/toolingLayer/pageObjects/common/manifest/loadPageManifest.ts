// src/toolingLayer/pageObjects/common/manifest/loadPageManifest.ts

import path from "node:path";
import { loadManifestIndex } from "./loadManifestIndex";
import { loadPageManifestEntry } from "./loadPageManifestEntry";
import type { PageObjectsManifest } from "./types";

function emptyManifest(): PageObjectsManifest {
    return { version: 1, generatedAt: new Date().toISOString(), pages: {} };
}

function manifestPaths(inputPath: string): { indexFile: string; pagesDir: string } {
    return inputPath.endsWith(".json")
        ? {
              indexFile: inputPath,
              pagesDir: path.join(path.dirname(inputPath), "pages"),
          }
        : {
              indexFile: path.join(inputPath, "index.json"),
              pagesDir: path.join(inputPath, "pages"),
          };
}

export function loadPageManifest(inputPath: string): PageObjectsManifest {
    const { indexFile, pagesDir } = manifestPaths(inputPath);
    const index = loadManifestIndex(indexFile);
    const pages: Record<string, PageObjectsManifest["pages"][string]> = {};

    for (const [pageKey, fileName] of Object.entries(index.pages)) {
        const entry = loadPageManifestEntry(path.join(pagesDir, fileName));
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
