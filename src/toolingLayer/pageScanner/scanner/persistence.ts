// src/toolingLayer/pageScanner/scanner/persistence.ts

import path from "node:path";

import { ensureDir, safeReadJson, safeWriteJson } from "@utils/fs";
import {
    PAGE_SCANNER_DIR,
    PAGE_SCANNER_MANIFEST_INDEX_FILE,
    toRepoRelative,
} from "@utils/paths";
import { parsePageKey } from "./pageKey/parsePageKey";
import type { PageMap } from "./types";
import type { ScannerManifestIndex } from "./reporting/types";

export function buildScannerFilePath(rootDir: string, pageKey: string): string {
    const scope = parsePageKey(pageKey);

    return path.join(
        rootDir,
        scope.platform,
        scope.application,
        scope.product,
        `${scope.name}.json`
    );
}

export function buildManifestFilePath(rootDir: string): string {
    return path.join(
        rootDir,
        path.relative(PAGE_SCANNER_DIR, PAGE_SCANNER_MANIFEST_INDEX_FILE)
    );
}

function emptyManifest(): ScannerManifestIndex {
    return {
        version: 1,
        generatedAt: new Date(0).toISOString(),
        pages: {},
    };
}

function loadManifestIndex(filePath: string): ScannerManifestIndex {
    return safeReadJson<ScannerManifestIndex>(filePath) ?? emptyManifest();
}

export function saveManifestEntry(params: {
    manifestFile: string;
    pageKey: string;
    pageMapFile: string;
    pageMap: PageMap;
}): void {
    const current = loadManifestIndex(params.manifestFile);
    const next: ScannerManifestIndex = {
        version: 1,
        generatedAt: new Date().toISOString(),
        pages: {
            ...current.pages,
            [params.pageKey]: {
                file: toRepoRelative(params.pageMapFile),
                elementCount: Object.keys(params.pageMap.elements).length,
                scannedAt: params.pageMap.scannedAt,
            },
        },
    };

    if (JSON.stringify(current) === JSON.stringify(next)) {
        return;
    }

    ensureDir(path.dirname(params.manifestFile));
    safeWriteJson(params.manifestFile, next, true);
}

export function writePageMapFile(filePath: string, pageMap: PageMap): void {
    ensureDir(path.dirname(filePath));
    safeWriteJson(filePath, pageMap, true);
}
