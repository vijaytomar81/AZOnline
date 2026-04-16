// src/toolingLayer/pageObjects/common/manifest/saveManifestIndex.ts

import fs from "node:fs";
import path from "node:path";

import { ensureDir } from "@utils/fs";
import { loadManifestIndex } from "./loadManifestIndex";
import type { ManifestIndex } from "./types";

function buildPagesMap(pageKeys: string[]): Record<string, string> {
    return Object.fromEntries(
        [...pageKeys]
            .sort((a, b) => a.localeCompare(b))
            .map((pageKey) => [pageKey, `${pageKey}.json`])
    );
}

function samePagesMap(
    left: Record<string, string>,
    right: Record<string, string>
): boolean {
    const leftKeys = Object.keys(left).sort((a, b) => a.localeCompare(b));
    const rightKeys = Object.keys(right).sort((a, b) => a.localeCompare(b));

    if (leftKeys.length !== rightKeys.length) {
        return false;
    }

    for (let i = 0; i < leftKeys.length; i++) {
        const key = leftKeys[i];
        if (key !== rightKeys[i]) {
            return false;
        }

        if (left[key] !== right[key]) {
            return false;
        }
    }

    return true;
}

export function saveManifestIndex(indexFile: string, pageKeys: string[]): boolean {
    ensureDir(path.dirname(indexFile));

    const nextPages = buildPagesMap(pageKeys);
    const existing = fs.existsSync(indexFile)
        ? loadManifestIndex(indexFile)
        : null;

    if (existing && samePagesMap(existing.pages, nextPages)) {
        return false;
    }

    const next: ManifestIndex = {
        version: 1,
        generatedAt: new Date().toISOString(),
        pages: nextPages,
    };

    fs.writeFileSync(indexFile, JSON.stringify(next, null, 2), "utf8");
    return true;
}
