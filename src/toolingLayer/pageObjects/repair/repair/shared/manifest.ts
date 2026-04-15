// src/toolingLayer/pageObjects/repair/repair/shared/manifest.ts

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import { ensureDir, safeReadJson } from "@utils/fs";
import { getPageArtifactPaths } from "@toolingLayer/pageObjects/common/pagePaths";
import { loadAllPageMaps } from "@toolingLayer/pageObjects/common/readPageMap";

export type ManifestPagePaths = {
    pageObjectImport: string;
    pageObjectFile: string;
    elementsFile: string;
    aliasesGeneratedFile: string;
    aliasesFile: string;
    pageMapFile: string;
};

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
};

export type ManifestIndex = {
    version: number;
    generatedAt: string;
    pages: Record<string, string>;
};

export type PageObjectsManifest = {
    version: number;
    generatedAt: string;
    pages: Record<string, ManifestPageEntry>;
};

function toRelative(absPath: string): string {
    return path.relative(process.cwd(), absPath).replace(/\\/g, "/");
}

function hashFile(absPath: string): string {
    const raw = fs.readFileSync(absPath, "utf8");
    return crypto.createHash("sha1").update(raw).digest("hex");
}

function emptyIndex(): ManifestIndex {
    return { version: 1, generatedAt: new Date(0).toISOString(), pages: {} };
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

function readIndex(indexFile: string): ManifestIndex {
    return safeReadJson<ManifestIndex>(indexFile) ?? emptyIndex();
}

function readPageEntry(filePath: string): ManifestPageEntry | null {
    return safeReadJson<ManifestPageEntry>(filePath) ?? null;
}

export function buildManifest(pageObjectsDir: string, mapsDir: string): PageObjectsManifest {
    const pages: Record<string, ManifestPageEntry> = {};

    for (const item of loadAllPageMaps(mapsDir)) {
        const pageKey = item.pageMap.pageKey;
        const artifact = getPageArtifactPaths(pageObjectsDir, pageKey);
        const parts = pageKey.split(".");
        const product = parts[0] ?? "unknown";
        const group = parts[1] ?? "common";
        const name = parts.slice(2).join(".");

        pages[pageKey] = {
            pageKey,
            product,
            group,
            name,
            className: artifact.className,
            paths: {
                pageObjectImport: `@businessLayer/pageObjects/objects/${product}/${group}/${name}/${artifact.className}`,
                pageObjectFile: toRelative(artifact.pageObjectPath),
                elementsFile: toRelative(artifact.elementsPath),
                aliasesGeneratedFile: toRelative(artifact.aliasesGeneratedPath),
                aliasesFile: toRelative(artifact.aliasesHumanPath),
                pageMapFile: toRelative(item.absPath),
            },
            urlPath: item.pageMap.urlPath,
            title: item.pageMap.title,
            elementCount: Object.keys(item.pageMap.elements ?? {}).length,
            scannedAt: item.pageMap.scannedAt,
            mapHash: hashFile(item.absPath),
        };
    }

    return {
        version: 1,
        generatedAt: new Date().toISOString(),
        pages,
    };
}

export function readManifest(manifestRoot: string): PageObjectsManifest {
    const { indexFile, pagesDir } = manifestPaths(manifestRoot);
    const index = readIndex(indexFile);
    const pages: Record<string, ManifestPageEntry> = {};

    for (const [pageKey, fileName] of Object.entries(index.pages)) {
        const entry = readPageEntry(path.join(pagesDir, fileName));
        if (entry) pages[pageKey] = entry;
    }

    return {
        version: index.version,
        generatedAt: index.generatedAt,
        pages,
    };
}

export function writeManifest(manifestRoot: string, manifest: PageObjectsManifest): void {
    const { indexFile, pagesDir } = manifestPaths(manifestRoot);
    ensureDir(pagesDir);

    const pageKeys = Object.keys(manifest.pages).sort((a, b) => a.localeCompare(b));
    const index: ManifestIndex = {
        version: 1,
        generatedAt: new Date().toISOString(),
        pages: Object.fromEntries(pageKeys.map((pageKey) => [pageKey, `${pageKey}.json`])),
    };

    for (const file of fs.readdirSync(pagesDir)) {
        if (!file.endsWith(".json")) continue;
        const pageKey = file.slice(0, -5);
        if (!(pageKey in manifest.pages)) {
            fs.unlinkSync(path.join(pagesDir, file));
        }
    }

    for (const pageKey of pageKeys) {
        fs.writeFileSync(
            pageKeyToManifestFile(pagesDir, pageKey),
            JSON.stringify(manifest.pages[pageKey], null, 2) + "\n",
            "utf8"
        );
    }

    fs.writeFileSync(indexFile, JSON.stringify(index, null, 2) + "\n", "utf8");
}