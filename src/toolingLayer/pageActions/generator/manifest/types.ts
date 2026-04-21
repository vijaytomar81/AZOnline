// src/toolingLayer/pageActions/generator/manifest/types.ts

export type PageScope = {
    platform: string;
    application: string;
    product: string;
    name: string;
    namespace: string;
};

export type PageObjectManifestIndex = {
    version: number;
    generatedAt: string;
    pages: Record<string, string>;
};

export type PageObjectManifestPage = {
    pageKey: string;
    scope: PageScope;
    className: string;
    paths: {
        pageObjectImport: string;
        pageObjectFile: string;
        elementsFile: string;
        aliasesGeneratedFile: string;
        aliasesFile: string;
        pageMapFile: string;
    };
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

export type PageActionManifestIndex = {
    version: number;
    generatedAt: string;
    actions: Record<string, string>;
};

export type PageActionManifestEntry = {
    pageKey: string;
    actionKey: string;
    actionName: string;
    scope: PageScope;
    paths: {
        actionFile: string;
        productIndexFile: string;
        applicationIndexFile: string;
        platformIndexFile: string;
        actionsIndexFile: string;
        rootIndexFile: string;
        sourcePageObjectFile: string;
    };
    generatedAt: string;
};
