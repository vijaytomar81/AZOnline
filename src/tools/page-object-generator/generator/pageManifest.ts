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

export type PageObjectsManifest = {
    version: 1;
    generatedAt: string;
    pages: Record<string, PageManifestEntry>;
};

function relativeToRepo(absPath: string): string {
    return path.relative(process.cwd(), absPath).replace(/\\/g, "/");
}

function splitPageKey(pageKey: string): {
    product: string;
    group: string;
    name: string;
} {
    const parts = pageKey.split(".");

    return {
        product: parts[0] || "unknown",
        group: parts[1] || "common",
        name: parts.slice(2).join(".") || parts.slice(-1)[0] || "page",
    };
}

export function createEmptyPageManifest(): PageObjectsManifest {
    return {
        version: 1,
        generatedAt: new Date().toISOString(),
        pages: {},
    };
}

export function loadPageManifest(filePath: string): PageObjectsManifest {
    if (!fs.existsSync(filePath)) {
        return createEmptyPageManifest();
    }

    try {
        const raw = fs.readFileSync(filePath, "utf8");
        const parsed = JSON.parse(raw) as Partial<PageObjectsManifest>;

        return {
            version: 1,
            generatedAt:
                typeof parsed.generatedAt === "string"
                    ? parsed.generatedAt
                    : new Date().toISOString(),
            pages:
                parsed.pages && typeof parsed.pages === "object"
                    ? (parsed.pages as Record<string, PageManifestEntry>)
                    : {},
        };
    } catch {
        return createEmptyPageManifest();
    }
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
        pageObjectFile: relativeToRepo(artifact.pageObjectPath),
        elementsFile: relativeToRepo(artifact.elementsPath),
        aliasesGeneratedFile: relativeToRepo(artifact.aliasesGeneratedPath),
        aliasesFile: relativeToRepo(artifact.aliasesHumanPath),
        pageMapFile: relativeToRepo(pageMapFilePath),

        urlPath:
            typeof pageMap.urlPath === "string" && pageMap.urlPath.trim()
                ? pageMap.urlPath.trim()
                : undefined,

        title:
            typeof pageMap.title === "string" && pageMap.title.trim()
                ? pageMap.title.trim()
                : undefined,

        elementCount: Object.keys(pageMap.elements ?? {}).length,

        scannedAt:
            typeof pageMap.scannedAt === "string" && pageMap.scannedAt.trim()
                ? pageMap.scannedAt.trim()
                : undefined,

        mapHash,
    };
}

export function upsertPageManifestEntry(params: {
    manifest: PageObjectsManifest;
    entry: PageManifestEntry;
}): void {
    const { manifest, entry } = params;
    manifest.pages[entry.pageKey] = entry;
}

export function removeMissingPagesFromManifest(params: {
    manifest: PageObjectsManifest;
    validPageKeys: string[];
}): number {
    const { manifest, validPageKeys } = params;
    const valid = new Set(validPageKeys);

    let removed = 0;

    for (const existingKey of Object.keys(manifest.pages)) {
        if (!valid.has(existingKey)) {
            delete manifest.pages[existingKey];
            removed++;
        }
    }

    return removed;
}

export function savePageManifest(
    filePath: string,
    manifest: PageObjectsManifest
): void {
    ensureDir(path.dirname(filePath));

    const sortedPages = Object.fromEntries(
        Object.entries(manifest.pages).sort(([a], [b]) => a.localeCompare(b))
    );

    const next: PageObjectsManifest = {
        version: 1,
        generatedAt: new Date().toISOString(),
        pages: sortedPages,
    };

    fs.writeFileSync(filePath, JSON.stringify(next, null, 2), "utf8");
}