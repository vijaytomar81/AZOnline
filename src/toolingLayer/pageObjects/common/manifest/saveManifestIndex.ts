// src/toolingLayer/pageObjects/common/manifest/saveManifestIndex.ts

import { ensureDir } from "@utils/fs";
import path from "node:path";
import type { ManifestIndex } from "./types";

export function saveManifestIndex(indexFile: string, pageKeys: string[]): void {
    ensureDir(path.dirname(indexFile));

    const pages = Object.fromEntries(
        [...pageKeys]
            .sort((a, b) => a.localeCompare(b))
            .map((pageKey) => [pageKey, `${pageKey}.json`])
    );

    const next: ManifestIndex = {
        version: 1,
        generatedAt: new Date().toISOString(),
        pages,
    };

    require("node:fs").writeFileSync(
        indexFile,
        JSON.stringify(next, null, 2),
        "utf8"
    );
}
