// src/toolingLayer/pageObjects/common/pageMaps/pageScannerManifest.ts

import path from "node:path";

import { safeReadJson } from "@utils/fs";
import { PAGE_SCANNER_MANIFEST_INDEX_FILE } from "@utils/paths";

export type PageScannerManifestEntry = {
    file: string;
    elementCount: number;
    scannedAt: string;
};

export type PageScannerManifestIndex = {
    version: 1;
    generatedAt: string;
    pages: Record<string, PageScannerManifestEntry>;
};

function emptyManifest(): PageScannerManifestIndex {
    return {
        version: 1,
        generatedAt: new Date(0).toISOString(),
        pages: {},
    };
}

export function loadPageScannerManifestIndex(): PageScannerManifestIndex {
    return (
        safeReadJson<PageScannerManifestIndex>(PAGE_SCANNER_MANIFEST_INDEX_FILE) ??
        emptyManifest()
    );
}

export function listPageScannerManifestEntries(): Array<
    [string, PageScannerManifestEntry]
> {
    return Object.entries(loadPageScannerManifestIndex().pages).sort(([a], [b]) =>
        a.localeCompare(b)
    );
}

export function resolveScannerPageMapPath(filePath: string): string {
    return path.isAbsolute(filePath)
        ? filePath
        : path.join(process.cwd(), filePath);
}
