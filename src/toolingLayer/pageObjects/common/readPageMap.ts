// src/toolingLayer/pageObjects/common/readPageMap.ts

import { safeReadJson } from "@utils/fs";
import type { PageMap } from "@toolingLayer/pageObjects/generator/generator/types";
import {
    listPageScannerManifestEntries,
    resolveScannerPageMapPath,
} from "./pageMaps/pageScannerManifest";

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

export function listPageMapFiles(_mapsDir: string): string[] {
    return listPageScannerManifestEntries().map(([pageKey]) => pageKey);
}

export function loadAllPageMaps(_mapsDir: string): LoadedPageMap[] {
    const loaded: LoadedPageMap[] = [];

    for (const [pageKey, entry] of listPageScannerManifestEntries()) {
        const absPath = resolveScannerPageMapPath(entry.file);
        const pageMap = safeReadJson<PageMap>(absPath);

        if (!isValidPageMap(pageMap)) {
            continue;
        }

        loaded.push({
            fileName: pageKey,
            absPath,
            pageMap,
        });
    }

    return loaded.sort((a, b) => a.pageMap.pageKey.localeCompare(b.pageMap.pageKey));
}
