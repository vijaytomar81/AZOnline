// src/toolingLayer/pageScanner/scanner/runner.ts

import { ensureDir, safeReadJson } from "@utils/fs";
import {
    PAGE_SCAN_OPERATIONS,
    type PageScanOperation,
} from "@configLayer/tooling/pageScanner";
import {
    PAGE_SCANNER_DIR,
    PAGE_SCANNER_MANIFEST_DIR,
} from "@utils/paths";
import { connectAndGetPage } from "./browser";
import { extractDomElements } from "./domExtract";
import { parsePageKey } from "./pageKey/parsePageKey";
import { buildPageMap } from "./pageMap/buildPageMap";
import { diffPageMaps, type PageMapDiff } from "./pageMap/diffPageMaps";
import { mergePageMaps } from "./pageMap/mergePageMaps";
import {
    buildManifestFilePath,
    buildScannerFilePath,
    saveManifestEntry,
    writePageMapFile,
} from "./persistence";
import type { PageMap, ScanPageOptions } from "./types";
import type { ScanPageResult } from "./reporting/types";

function emptyDiff(): PageMapDiff {
    return { added: [], updated: [], removed: [], unchanged: [] };
}

function buildFailedResult(params: {
    pageKey: string;
    outFile: string;
    message: string;
    scope: ReturnType<typeof parsePageKey>;
}): ScanPageResult {
    return {
        pageKey: params.pageKey,
        operation: PAGE_SCAN_OPERATIONS.FAILED,
        outFile: params.outFile,
        elementsFound: 0,
        diff: emptyDiff(),
        errorMessage: params.message,
        scope: params.scope,
    };
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

function buildInitialDiff(pageMap: PageMap): PageMapDiff {
    return {
        added: Object.keys(pageMap.elements).sort(),
        updated: [],
        removed: [],
        unchanged: [],
    };
}

export async function scanPage(
    opts: ScanPageOptions
): Promise<ScanPageResult> {
    const rootDir = opts.outDir ?? PAGE_SCANNER_DIR;
    const manifestFile = buildManifestFilePath(rootDir);
    const outFile = buildScannerFilePath(rootDir, opts.pageKey);
    const scope = parsePageKey(opts.pageKey);

    ensureDir(rootDir);
    ensureDir(PAGE_SCANNER_MANIFEST_DIR);

    const { page, detach, url } = await connectAndGetPage(opts);

    try {
        const rawTitle = await page.title().catch(() => "");
        const scanned = await extractDomElements(page);

        const pageMap = buildPageMap({
            pageKey: opts.pageKey,
            url,
            title: rawTitle?.trim() || undefined,
            scanned,
            verbose: opts.verbose,
            onDebug: opts.verbose ? (message) => opts.log.debug(message) : undefined,
        });

        const elementsFound = Object.keys(pageMap.elements).length;
        if (elementsFound === 0) {
            const message = `No interactive elements found on page: ${opts.pageKey}`;
            opts.log.error(message);

            return buildFailedResult({
                pageKey: opts.pageKey,
                outFile,
                message,
                scope,
            });
        }

        const existing = safeReadJson<PageMap>(outFile);
        const merged = existing ? mergePageMaps(existing, pageMap) : pageMap;
        const diff = existing ? diffPageMaps(existing, merged) : buildInitialDiff(pageMap);
        const operation = resolveOperation(existing, merged, diff);

        if (operation !== PAGE_SCAN_OPERATIONS.UNCHANGED) {
            writePageMapFile(outFile, merged);
            opts.log.info(
                `Page map ${existing ? "written (merged)" : "written"}: ${outFile}`
            );
        } else {
            opts.log.info(`No changes detected for page map: ${outFile}`);
        }

        saveManifestEntry({
            manifestFile,
            pageKey: opts.pageKey,
            pageMapFile: outFile,
            pageMap: merged,
        });

        return {
            pageKey: opts.pageKey,
            scope,
            operation,
            outFile,
            elementsFound,
            diff,
        };
    } finally {
        await detach();
    }
}
