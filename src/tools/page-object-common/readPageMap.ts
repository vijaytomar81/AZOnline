// src/tools/page-object-common/readPageMap.ts

import path from "node:path";

import { listFiles, safeReadJson } from "@utils/fs";
import type { PageMap } from "@/tools/page-object-generator/generator/types";

/**
 * Represents a loaded page-map file.
 */
export type LoadedPageMap = {
    fileName: string;
    absPath: string;
    pageMap: PageMap;
};

function isValidPageMap(pageMap: PageMap | null | undefined): pageMap is PageMap {
    return Boolean(
        pageMap &&
        typeof pageMap.pageKey === "string" &&
        pageMap.pageKey.trim() &&
        pageMap.elements &&
        typeof pageMap.elements === "object"
    );
}

export function listPageMapFiles(mapsDir: string): string[] {
    return listFiles(mapsDir, { ext: ".json" }).filter((f) => !f.startsWith("."));
}

export function loadAllPageMaps(mapsDir: string): LoadedPageMap[] {
    const loaded: LoadedPageMap[] = [];

    for (const fileName of listPageMapFiles(mapsDir)) {
        const absPath = path.join(mapsDir, fileName);
        const pageMap = safeReadJson<PageMap>(absPath);

        if (!isValidPageMap(pageMap)) {
            continue;
        }

        loaded.push({
            fileName,
            absPath,
            pageMap,
        });
    }

    return loaded.sort((a, b) => a.pageMap.pageKey.localeCompare(b.pageMap.pageKey));
}