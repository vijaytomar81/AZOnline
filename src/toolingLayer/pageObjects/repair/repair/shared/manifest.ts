// src/toolingLayer/pageObjects/repair/repair/shared/manifest.ts

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import { ensureDir } from "@utils/fs";
import { buildPageArtifact } from "@toolingLayer/pageObjects/common/artifacts/buildPageArtifact";
import { buildPageManifestEntry } from "@toolingLayer/pageObjects/common/manifest/buildPageManifestEntry";
import { loadManifestIndex } from "@toolingLayer/pageObjects/common/manifest/loadManifestIndex";
import { loadPageManifestEntry } from "@toolingLayer/pageObjects/common/manifest/loadPageManifestEntry";
import { loadAllPageMaps } from "@toolingLayer/pageObjects/common/readPageMap";
import type {
    ManifestIndex,
    PageManifestEntry,
    PageObjectsManifest as CommonPageObjectsManifest,
} from "@toolingLayer/pageObjects/common/manifest/types";

export type ManifestPagePaths = PageManifestEntry["paths"];

export type ManifestPageEntry = {
    pageKey: string;
    product: string;
    group: string;
    name: string;
    className: string;
    paths: ManifestPagePaths;
    urlPath?: string;
    title?: string;
    elementCount: number;
    scannedAt?: string;
    mapHash: string;
    scope: PageManifestEntry["scope"];
    pageMeta: PageManifestEntry["pageMeta"];
    source: PageManifestEntry["source"];
};

export type PageObjectsManifest = {
    version: number;
    generatedAt: string;
    pages: Record<string, ManifestPageEntry>;
};

function hashFile(absPath: string): string {
    const raw = fs.readFileSync(absPath, "utf8");
    return crypto.createHash("sha1").update(raw).digest("hex");
}

function emptyManifest(): PageObjectsManifest {
    return { version: 1, generatedAt: new Date(0).toISOString(), pages: {} };
}

function manifestPaths(manifestRoot: string): { indexFile: string; pagesDir: string } {
    return {
        indexFile: path.join(manifestRoot, "index.json"),
        pagesDir: path.join(manifestRoot, "pages"),
    };
}

function pageKeyToManifestFile(pagesDir: string, pageKey: string): string {
    return path.join(pagesDir, `${pageKey}.json`);
}

function toRepairEntry(entry: PageManifestEntry): ManifestPageEntry {
    return {
        pageKey: entry.pageKey,
        product: entry.scope.product,
        group: entry.scope.application,
        name: entry.scope.name,
        className: entry.className,
        paths: entry.paths,
        urlPath: entry.pageMeta.urlPath,
        title: entry.pageMeta.title,
        elementCount: entry.pageMeta.elementCount,
        scannedAt: entry.source.scannedAt,
        mapHash: entry.source.mapHash,
        scope: entry.scope,
        pageMeta: entry.pageMeta,
        source: entry.source,
    };
}

function toCommonManifest(
    manifest: PageObjectsManifest
): CommonPageObjectsManifest {
    const pages = Object.fromEntries(
        Object.entries(manifest.pages).map(([pageKey, entry]) => [
            pageKey,
            {
                pageKey: entry.pageKey,
                scope: entry.scope,
                className: entry.className,
                paths: entry.paths,
                pageMeta: entry.pageMeta,
                source: entry.source,
            },
        ])
    );

    return {
        version: 1,
        generatedAt: manifest.generatedAt,
        pages,
    };
}

export function buildManifest(
    pageObjectsDir: string,
    mapsDir: string
): PageObjectsManifest {
    const pages: Record<string, ManifestPageEntry> = {};

    for (const item of loadAllPageMaps(mapsDir)) {
        const artifact = buildPageArtifact(pageObjectsDir, item.pageMap.pageKey);
        const result = buildPageManifestEntry({
            pageMap: item.pageMap,
            artifact,
            pageMapFilePath: item.absPath,
            mapHash: hashFile(item.absPath),
        });

        if (result.ok) {
            pages[item.pageMap.pageKey] = toRepairEntry(result.entry);
        }
    }

    return {
        version: 1,
        generatedAt: new Date().toISOString(),
        pages,
    };
}

export function readManifest(manifestRoot: string): PageObjectsManifest {
    const { indexFile, pagesDir } = manifestPaths(manifestRoot);
    const index = loadManifestIndex(indexFile);
    const pages: Record<string, ManifestPageEntry> = {};

    for (const [pageKey, fileName] of Object.entries(index.pages)) {
        const entry = loadPageManifestEntry(path.join(pagesDir, fileName));
        if (entry) {
            pages[pageKey] = toRepairEntry(entry);
        }
    }

    if (!index.generatedAt) return emptyManifest();

    return {
        version: index.version,
        generatedAt: index.generatedAt,
        pages,
    };
}

export function writeManifest(
    manifestRoot: string,
    manifest: PageObjectsManifest
): void {
    const { indexFile, pagesDir } = manifestPaths(manifestRoot);
    ensureDir(pagesDir);

    const commonManifest = toCommonManifest(manifest);
    const pageKeys = Object.keys(commonManifest.pages).sort((a, b) => a.localeCompare(b));
    const index: ManifestIndex = {
        version: 1,
        generatedAt: new Date().toISOString(),
        pages: Object.fromEntries(
            pageKeys.map((pageKey) => [pageKey, `${pageKey}.json`])
        ),
    };

    for (const file of fs.readdirSync(pagesDir)) {
        if (!file.endsWith(".json")) continue;
        const pageKey = file.slice(0, -5);
        if (!(pageKey in commonManifest.pages)) {
            fs.unlinkSync(path.join(pagesDir, file));
        }
    }

    for (const pageKey of pageKeys) {
        fs.writeFileSync(
            pageKeyToManifestFile(pagesDir, pageKey),
            JSON.stringify(commonManifest.pages[pageKey], null, 2) + "\n",
            "utf8"
        );
    }

    fs.writeFileSync(indexFile, JSON.stringify(index, null, 2) + "\n", "utf8");
}
