// src/dataLayer/runtime/manifest/types.ts

export type GeneratedManifestItem = {
    key: string;
    domain: string;
    sheetName: string;
    schemaName: string;
    filePath: string;
    validationReportPath?: string;
    caseCount: number;
    generatedAt: string;
};

export type GeneratedManifest = {
    generatedAt: string;
    data: Record<string, GeneratedManifestItem>;
};