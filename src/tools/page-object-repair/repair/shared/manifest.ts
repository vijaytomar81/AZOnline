// src/tools/page-object-repair/repair/shared/manifest.ts

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import { safeReadJson } from "@/utils/fs";
import { getPageArtifactPaths } from "@/tools/page-object-common/pagePaths";
import { loadAllPageMaps } from "@/tools/page-object-common/readPageMap";

export type ManifestPageEntry = {
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
            pageObjectImportPath: `@page-objects/${product}/${group}/${name}/${artifact.className}`,
            pageObjectFile: toRelative(artifact.pageObjectPath),
            elementsFile: toRelative(artifact.elementsPath),
            aliasesGeneratedFile: toRelative(artifact.aliasesGeneratedPath),
            aliasesFile: toRelative(artifact.aliasesHumanPath),
            pageMapFile: toRelative(item.absPath),
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

export function readManifest(filePath: string): PageObjectsManifest {
    return (
        safeReadJson<PageObjectsManifest>(filePath) ?? {
            version: 1,
            generatedAt: new Date(0).toISOString(),
            pages: {},
        }
    );
}

export function writeManifest(filePath: string, manifest: PageObjectsManifest): void {
    fs.writeFileSync(filePath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
}