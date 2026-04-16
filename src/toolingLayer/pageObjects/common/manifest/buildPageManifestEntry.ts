// src/toolingLayer/pageObjects/common/manifest/buildPageManifestEntry.ts

import path from "node:path";

import type { PageMap } from "@toolingLayer/pageObjects/generator/generator/types";
import type { PageArtifact } from "../artifacts/types";
import { buildUrlReFromUrlPath } from "@toolingLayer/pageObjects/generator/generator/urlMeta";
import { parsePageScope } from "./parsePageScope";
import type {
    BuildPageManifestEntryResult,
    PageManifestEntry,
} from "./types";

function toRelative(absPath: string): string {
    return path.relative(process.cwd(), absPath).replace(/\\/g, "/");
}

export function buildPageManifestEntry(params: {
    pageMap: PageMap;
    artifact: PageArtifact;
    pageMapFilePath: string;
    mapHash: string;
}): BuildPageManifestEntryResult {
    const { pageMap, artifact, pageMapFilePath, mapHash } = params;
    const scopeResult = parsePageScope(pageMap.pageKey);

    if (!scopeResult.ok) {
        return {
            ok: false,
            pageKey: pageMap.pageKey,
            reason: scopeResult.reason,
        };
    }

    const urlPath = pageMap.urlPath?.trim() || undefined;

    const entry: PageManifestEntry = {
        pageKey: pageMap.pageKey,
        scope: scopeResult.value,
        className: artifact.className,
        paths: {
            pageObjectImport: artifact.registryImportPath,
            pageObjectFile: toRelative(artifact.pageObjectPath),
            elementsFile: toRelative(artifact.elementsPath),
            aliasesGeneratedFile: toRelative(artifact.aliasesGeneratedPath),
            aliasesFile: toRelative(artifact.aliasesHumanPath),
            pageMapFile: toRelative(pageMapFilePath),
        },
        pageMeta: {
            urlPath: pageMap.urlPath?.trim() || undefined,
            urlPathRe: buildUrlReFromUrlPath(pageMap.urlPath?.trim() || ""),
            title: pageMap.title?.trim() || undefined,
            elementCount: Object.keys(pageMap.elements ?? {}).length,
        },
        source: {
            scannedUrl: pageMap.url?.trim() || undefined,
            scannedAt: pageMap.scannedAt?.trim() || undefined,
            mapHash,
        },
    };

    return { ok: true, entry };
}
