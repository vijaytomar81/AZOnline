// src/pageObjectTools/page-object-generator/generator/pageMapLoader.ts

import fs from "node:fs";

import type { PageMap } from "./types";
import { listPageMapFiles, loadAllPageMaps } from "@/pageObjectTools/page-object-common/readPageMap";

export type LoadedPageMapFile = {
    file: string;
    absPath: string;
    raw: string;
    pageMap: PageMap;
};

/**
 * Returns sorted list of page-map filenames.
 */
export function readAllPageMapFiles(mapsDir: string): string[] {
    return listPageMapFiles(mapsDir);
}

/**
 * Loads a single page-map file including its raw JSON text.
 */
export function loadPageMapFile(mapsDir: string, file: string): LoadedPageMapFile {
    const loaded = loadAllPageMaps(mapsDir).find((m) => m.fileName === file);

    if (!loaded) {
        throw new Error(`Page-map not found or invalid: ${file}`);
    }

    const raw = fs.readFileSync(loaded.absPath, "utf8");

    return {
        file,
        absPath: loaded.absPath,
        raw,
        pageMap: loaded.pageMap,
    };
}