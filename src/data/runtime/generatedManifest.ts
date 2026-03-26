// src/data/runtime/generatedManifest.ts

import fs from "node:fs";
import { ensureParentDir } from "@utils/fs";
import {
    DATA_DOMAINS,
    DATA_GENERATED_INDEX_FILE,
    ROOT,
    toRepoRelative,
} from "@utils/paths";

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

function buildEmptyManifest(): GeneratedManifest {
    return {
        generatedAt: new Date().toISOString(),
        data: {},
    };
}

export function buildGeneratedManifestKey(args: {
    domain: string;
    schemaName: string;
    sheetName: string;
}): string {
    return `${args.domain}:${args.schemaName}:${args.sheetName}`;
}

export function readGeneratedManifest(): GeneratedManifest {
    if (!fs.existsSync(DATA_GENERATED_INDEX_FILE)) {
        return buildEmptyManifest();
    }

    try {
        const raw = fs.readFileSync(DATA_GENERATED_INDEX_FILE, "utf8");
        const parsed = JSON.parse(raw) as Partial<GeneratedManifest>;

        return {
            generatedAt: String(parsed.generatedAt ?? new Date().toISOString()),
            data: parsed.data ?? {},
        };
    } catch {
        return buildEmptyManifest();
    }
}

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

export function resolveManifestFilePath(
    item?: Pick<GeneratedManifestItem, "filePath">
): string | null {
    if (!item?.filePath) return null;
    return fs.existsSync(item.filePath) ? item.filePath : `${ROOT}/${item.filePath}`.replace(/\/+/g, "/");
}

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