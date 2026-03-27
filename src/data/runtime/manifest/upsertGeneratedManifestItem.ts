// src/data/runtime/manifest/upsertGeneratedManifestItem.ts

import fs from "node:fs";
import { ensureParentDir } from "@utils/fs";
import {
    DATA_DOMAINS,
    DATA_GENERATED_INDEX_FILE,
    toRepoRelative,
} from "@utils/paths";
import type { GeneratedManifest } from "./types";
import { buildGeneratedManifestKey } from "./buildGeneratedManifestKey";
import { readGeneratedManifest } from "./readGeneratedManifest";

export function upsertGeneratedManifestItem(args: {
    domain?: string;
    sheetName: string;
    schemaName: string;
    filePath: string;
    validationReportPath?: string;
    caseCount: number;
    generatedAt?: string;
}): GeneratedManifest {
    const domain = args.domain ?? DATA_DOMAINS.NEW_BUSINESS;
    const generatedAt = args.generatedAt ?? new Date().toISOString();

    const key = buildGeneratedManifestKey({
        domain,
        schemaName: args.schemaName,
        sheetName: args.sheetName,
    });

    const manifest = readGeneratedManifest();

    manifest.generatedAt = generatedAt;
    manifest.data[key] = {
        key,
        domain,
        sheetName: args.sheetName,
        schemaName: args.schemaName,
        filePath: toRepoRelative(args.filePath),
        validationReportPath: args.validationReportPath
            ? toRepoRelative(args.validationReportPath)
            : undefined,
        caseCount: args.caseCount,
        generatedAt,
    };

    ensureParentDir(DATA_GENERATED_INDEX_FILE);

    fs.writeFileSync(
        DATA_GENERATED_INDEX_FILE,
        JSON.stringify(manifest, null, 2),
        "utf8"
    );

    return manifest;
}