// src/data/runtime/manifest/generatedManifest.ts

import { DATA_DOMAINS } from "@utils/paths";
import { buildGeneratedManifestKey } from "./buildGeneratedManifestKey";
import { readGeneratedManifest } from "./readGeneratedManifest";
import { resolveManifestFilePath } from "./resolveManifestFilePath";
import { upsertGeneratedManifestItem } from "./upsertGeneratedManifestItem";
import type { GeneratedManifestItem } from "./types";

export function findGeneratedManifestItem(args: {
    domain?: string;
    sheetName: string;
    schemaName: string;
}): GeneratedManifestItem | undefined {
    const domain = args.domain ?? DATA_DOMAINS.NEW_BUSINESS;

    const key = buildGeneratedManifestKey({
        domain,
        schemaName: args.schemaName,
        sheetName: args.sheetName,
    });

    const manifest = readGeneratedManifest();
    return manifest.data[key];
}

export {
    buildGeneratedManifestKey,
    readGeneratedManifest,
    resolveManifestFilePath,
    upsertGeneratedManifestItem,
};