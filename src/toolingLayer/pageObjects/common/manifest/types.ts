// src/toolingLayer/pageObjects/common/manifest/types.ts

export type PageScope = {
    platform: string;
    application: string;
    product: string;
    name: string;
    namespace: string;
};

export type PageManifestPaths = {
    pageObjectImport: string;
    pageObjectFile: string;
    elementsFile: string;
    aliasesGeneratedFile: string;
    aliasesFile: string;
    pageMapFile: string;
};

export type PageManifestEntry = {
    pageKey: string;
    scope: PageScope;
    className: string;
    paths: PageManifestPaths;
    pageMeta: {
        urlPath?: string;
        urlPathRe?: string;
        title?: string;
        elementCount: number;
    };

    source: {
        scannedUrl?: string;
        scannedAt?: string;
        mapHash: string;
    };
};

export type ManifestIndex = {
    version: 1;
    generatedAt: string;
    pages: Record<string, string>;
};

export type PageObjectsManifest = {
    version: 1;
    generatedAt: string;
    pages: Record<string, PageManifestEntry>;
};

export type BuildPageManifestEntryResult =
    | { ok: true; entry: PageManifestEntry }
    | { ok: false; pageKey: string; reason: string };
