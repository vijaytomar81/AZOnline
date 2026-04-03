// src/pageActionTools/page-action-generator/manifest/types.ts

export type PageObjectManifestIndex = {
    version: number;
    generatedAt: string;
    pages: Record<string, string>;
};

export type PageObjectManifestPage = {
    pageKey: string;
    product: string;
    group: string;
    name: string;
    className: string;
    paths: {
        pageObjectImport: string;
        pageObjectFile: string;
        elementsFile: string;
        aliasesGeneratedFile: string;
        aliasesFile: string;
        pageMapFile: string;
    };
    urlPath?: string;
    title?: string;
    elementCount: number;
    scannedAt: string;
    mapHash: string;
};

export type PageActionManifestIndex = {
    version: number;
    generatedAt: string;
    actions: Record<string, string>;
};

export type PageActionManifestEntry = {
    pageKey: string;
    actionKey: string;
    group: string;
    actionName: string;
    paths: {
        actionFile: string;
        indexFile: string;
        sourcePageObjectFile: string;
    };
    generatedAt: string;
};
