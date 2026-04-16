// src/toolingLayer/pageObjects/common/pageMaps/loadPageMapFile.ts

import fs from "node:fs";

import { loadAllPageMaps } from "@toolingLayer/pageObjects/common/readPageMap";
import type { LoadedPageMapFile } from "./types";

export function loadPageMapFile(
    mapsDir: string,
    file: string
): LoadedPageMapFile {
    const loaded = loadAllPageMaps(mapsDir).find((m) => m.fileName === file);

    if (!loaded) {
        throw new Error(`Page-map not found or invalid: ${file}`);
    }

    return {
        file,
        absPath: loaded.absPath,
        raw: fs.readFileSync(loaded.absPath, "utf8"),
        pageMap: loaded.pageMap,
    };
}
