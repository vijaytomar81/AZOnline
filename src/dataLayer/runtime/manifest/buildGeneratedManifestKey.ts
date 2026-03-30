// src/dataLayer/runtime/manifest/buildGeneratedManifestKey.ts

export function buildGeneratedManifestKey(args: {
    domain: string;
    schemaName: string;
    sheetName: string;
}): string {
    return `${args.domain}:${args.schemaName}:${args.sheetName}`;
}