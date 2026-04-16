// src/toolingLayer/pageScanner/scanner/runner.ts

import path from "node:path";

import {
    PAGE_SCAN_OPERATIONS,
    type PageScanOperation,
} from "@configLayer/tooling/pageScanner";
import { ensureDir, safeReadJson, safeWriteJson } from "@utils/fs";
import {
    PAGE_SCANNER_DIR,
    PAGE_SCANNER_MANIFEST_DIR,
    PAGE_SCANNER_MANIFEST_INDEX_FILE,
    toRepoRelative,
} from "@utils/paths";
import { connectAndGetPage } from "./browser";
import { extractDomElements } from "./domExtract";
import { parsePageKey } from "./pageKey/parsePageKey";
import { buildPageMap } from "./pageMap/buildPageMap";
import { diffPageMaps, type PageMapDiff } from "./pageMap/diffPageMaps";
import { mergePageMaps } from "./pageMap/mergePageMaps";
import type { PageMap, ScanPageOptions } from "./types";
import type { ScanPageResult, ScannerManifestIndex } from "./reporting/types";

function emptyDiff(): PageMapDiff {
    return { added: [], updated: [], removed: [], unchanged: [] };
}

function buildScannerFilePath(rootDir: string, pageKey: string): string {
    const scope = parsePageKey(pageKey);
    return path.join(
        rootDir,
        scope.platform,
        scope.application,
        scope.product,
        `${scope.name}.json`
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

function saveManifestIndexIfChanged(
    filePath: string,
    next: ScannerManifestIndex
): void {
    const current = loadManifestIndex(filePath);
    const currentRaw = JSON.stringify(current);
    const nextRaw = JSON.stringify(next);

    if (currentRaw === nextRaw) {
        return;
    }

    ensureDir(path.dirname(filePath));
    safeWriteJson(filePath, next, true);
}

function saveManifestEntry(
    manifestFile: string,
    pageKey: string,
    pageMapFile: string,
    pageMap: PageMap
): void {
    const current = loadManifestIndex(manifestFile);
    const nextPages = {
        ...current.pages,
        [pageKey]: {
            file: toRepoRelative(pageMapFile),
            elementCount: Object.keys(pageMap.elements).length,
            scannedAt: pageMap.scannedAt,
        },
    };

    saveManifestIndexIfChanged(manifestFile, {
        version: 1,
        generatedAt: new Date().toISOString(),
        pages: nextPages,
    });
}

function hasMapMetaChanges(existing: PageMap, incoming: PageMap): boolean {
    return JSON.stringify({
        pageKey: existing.pageKey,
        url: existing.url,
        urlPath: existing.urlPath,
        title: existing.title,
        readiness: existing.readiness,
    }) !== JSON.stringify({
        pageKey: incoming.pageKey,
        url: incoming.url,
        urlPath: incoming.urlPath,
        title: incoming.title,
        readiness: incoming.readiness,
    });
}

function resolveOperation(
    existing: PageMap | null,
    merged: PageMap,
    diff: PageMapDiff
): PageScanOperation {
    if (!existing) {
        return PAGE_SCAN_OPERATIONS.CREATED;
    }

    const changed =
        diff.added.length > 0 ||
        diff.updated.length > 0 ||
        diff.removed.length > 0 ||
        hasMapMetaChanges(existing, merged);

    return changed
        ? PAGE_SCAN_OPERATIONS.MERGED
        : PAGE_SCAN_OPERATIONS.UNCHANGED;
}

export async function scanPage(
    opts: ScanPageOptions
): Promise<ScanPageResult> {
    const rootDir = opts.outDir ?? PAGE_SCANNER_DIR;
    const manifestFile = path.join(
        rootDir,
        path.relative(PAGE_SCANNER_DIR, PAGE_SCANNER_MANIFEST_INDEX_FILE)
    );
    const outFile = buildScannerFilePath(rootDir, opts.pageKey);
    const scope = parsePageKey(opts.pageKey);

    ensureDir(rootDir);
    ensureDir(PAGE_SCANNER_MANIFEST_DIR);

    const { page, detach, url } = await connectAndGetPage(opts);

    try {
        const title = (await page.title().catch(() => "")) || undefined;
        const scanned = await extractDomElements(page);

        const pageMap = buildPageMap({
            pageKey: opts.pageKey,
            url,
            title: title?.trim() || undefined,
            scanned,
            verbose: opts.verbose,
            onDebug: opts.verbose ? (message) => opts.log.debug(message) : undefined,
        });

        const existing = safeReadJson<PageMap>(outFile);
        const merged = existing ? mergePageMaps(existing, pageMap) : pageMap;
        const diff = existing ? diffPageMaps(existing, merged) : {
            added: Object.keys(pageMap.elements).sort(),
            updated: [],
            removed: [],
            unchanged: [],
        };

        const operation = resolveOperation(existing, merged, diff);

        if (operation !== PAGE_SCAN_OPERATIONS.UNCHANGED) {
            ensureDir(path.dirname(outFile));
            safeWriteJson(outFile, merged, true);
            opts.log.info(
                `Page map ${existing ? "written (merged)" : "written"}: ${outFile}`
            );
        } else {
            opts.log.info(`No changes detected for page map: ${outFile}`);
        }

        saveManifestEntry(manifestFile, opts.pageKey, outFile, merged);

        return {
            pageKey: opts.pageKey,
            scope,
            operation,
            outFile,
            elementsFound: Object.keys(merged.elements).length,
            diff,
        };
    } finally {
        await detach();
    }
}
