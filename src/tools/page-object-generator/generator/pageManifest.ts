// src/tools/page-object-generator/generator/pageManifest.ts

import fs from "node:fs";
import path from "node:path";

import { ensureDir } from "@/utils/fs";
import type { PageMap } from "./types";
import type { PageArtifact } from "./pageArtifact";

export type PageManifestEntry = {
    pageKey: string;
    product: string;
    group: string;
    name: string;
    className: string;
    pageObjectImportPath: string;
    pageObjectFile: string;
    elementsFile: string;
    aliasesGeneratedFile: string;
    aliasesFile: string;
    pageMapFile: string;
    urlPath?: string;
    title?: string;
    elementCount: number;
    scannedAt?: string;
    mapHash: string;
};

export type ManifestIndex = {
    version: 1;
    generatedAt: string;
    pageKeys: string[];
};

export type PageObjectsManifest = {
    version: 1;
    generatedAt: string;
    pages: Record<string, PageManifestEntry>;
};

function toRelative(absPath: string): string {
    return path.relative(process.cwd(), absPath).replace(/\\/g, "/");
}

function splitPageKey(pageKey: string) {
    const parts = pageKey.split(".");
    return {
        product: parts[0] || "unknown",
        group: parts[1] || "common",
        name: parts.slice(2).join(".") || "page",
    };
}

function emptyIndex(): ManifestIndex {
    return { version: 1, generatedAt: new Date().toISOString(), pageKeys: [] };
}

function emptyManifest(): PageObjectsManifest {
    return { version: 1, generatedAt: new Date().toISOString(), pages: {} };
}

function manifestPaths(inputPath: string): { indexFile: string; pagesDir: string } {
    if (inputPath.endsWith(".json")) {
        return {
            indexFile: inputPath,
            pagesDir: path.join(path.dirname(inputPath), "pages"),
        };
    }

    return {
        indexFile: path.join(inputPath, "index.json"),
        pagesDir: path.join(inputPath, "pages"),
    };
}

export function pageKeyToManifestFile(manifestPagesDir: string, pageKey: string): string {
    return path.join(manifestPagesDir, `${pageKey}.json`);
}

export function loadManifestIndex(indexFile: string): ManifestIndex {
    if (!fs.existsSync(indexFile)) {
        return emptyIndex();
    }

    try {
        const parsed = JSON.parse(fs.readFileSync(indexFile, "utf8")) as Partial<ManifestIndex>;
        return {
            version: 1,
            generatedAt: typeof parsed.generatedAt === "string" ? parsed.generatedAt : new Date().toISOString(),
            pageKeys: Array.isArray(parsed.pageKeys) ? [...parsed.pageKeys] : [],
        };
    } catch {
        return emptyIndex();
    }
}

export function saveManifestIndex(indexFile: string, pageKeys: string[]): void {
    ensureDir(path.dirname(indexFile));

    const next: ManifestIndex = {
        version: 1,
        generatedAt: new Date().toISOString(),
        pageKeys: [...pageKeys].sort((a, b) => a.localeCompare(b)),
    };

    fs.writeFileSync(indexFile, JSON.stringify(next, null, 2), "utf8");
}

export function loadPageManifestEntry(filePath: string): PageManifestEntry | null {
    if (!fs.existsSync(filePath)) return null;

    try {
        return JSON.parse(fs.readFileSync(filePath, "utf8")) as PageManifestEntry;
    } catch {
        return null;
    }
}

export function loadPageManifest(inputPath: string): PageObjectsManifest {
    const { indexFile, pagesDir } = manifestPaths(inputPath);
    const index = loadManifestIndex(indexFile);
    const pages: Record<string, PageManifestEntry> = {};

    for (const pageKey of index.pageKeys) {
        const entry = loadPageManifestEntry(pageKeyToManifestFile(pagesDir, pageKey));
        if (entry) {
            pages[pageKey] = entry;
        }
    }

    return {
        version: 1,
        generatedAt: index.generatedAt,
        pages,
    };
}

export function savePageManifestEntry(filePath: string, entry: PageManifestEntry): void {
    ensureDir(path.dirname(filePath));
    fs.writeFileSync(filePath, JSON.stringify(entry, null, 2), "utf8");
}

export function removeMissingPageManifestEntries(manifestPagesDir: string, validPageKeys: string[]): number {
    ensureDir(manifestPagesDir);
    const valid = new Set(validPageKeys);
    let removed = 0;

    for (const file of fs.readdirSync(manifestPagesDir)) {
        if (!file.endsWith(".json")) continue;
        const pageKey = file.slice(0, -5);

        if (!valid.has(pageKey)) {
            fs.unlinkSync(path.join(manifestPagesDir, file));
            removed++;
        }
    }

    return removed;
}

export function buildPageManifestEntry(params: {
    pageMap: PageMap;
    artifact: PageArtifact;
    pageMapFilePath: string;
    mapHash: string;
}): PageManifestEntry {
    const { pageMap, artifact, pageMapFilePath, mapHash } = params;
    const { product, group, name } = splitPageKey(pageMap.pageKey);

    return {
        pageKey: pageMap.pageKey,
        product,
        group,
        name,
        className: artifact.className,
        pageObjectImportPath: artifact.registryImportPath,
        pageObjectFile: toRelative(artifact.pageObjectPath),
        elementsFile: toRelative(artifact.elementsPath),
        aliasesGeneratedFile: toRelative(artifact.aliasesGeneratedPath),
        aliasesFile: toRelative(artifact.aliasesHumanPath),
        pageMapFile: toRelative(pageMapFilePath),
        urlPath: pageMap.urlPath?.trim() || undefined,
        title: pageMap.title?.trim() || undefined,
        elementCount: Object.keys(pageMap.elements ?? {}).length,
        scannedAt: pageMap.scannedAt?.trim() || undefined,
        mapHash,
    };
}