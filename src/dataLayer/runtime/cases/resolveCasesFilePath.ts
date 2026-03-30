// src/dataLayer/runtime/cases/resolveCasesFilePath.ts

import fs from "node:fs";
import { resolveSchemaName } from "../../data-definitions";
import {
    findGeneratedManifestItem,
    resolveManifestFilePath,
} from "@dataLayer/runtime/manifest/generatedManifest";
import { resolveExplicitCasesFile } from "./resolveExplicitCasesFile";
import { buildCasesFileNotFoundError } from "./buildCasesFileNotFoundError";

export function resolveCasesFilePath(
    sheetName: string,
    schemaName?: string
): string {
    const explicit = resolveExplicitCasesFile();
    if (explicit) {
        return explicit;
    }

    const resolvedSchema = resolveSchemaName(
        schemaName || process.env.SCHEMA,
        sheetName
    );

    const manifestItem = findGeneratedManifestItem({
        sheetName,
        schemaName: resolvedSchema,
    });

    const manifestPath = resolveManifestFilePath(manifestItem);

    if (!manifestPath) {
        throw buildCasesFileNotFoundError({
            sheetName,
            schemaName: resolvedSchema,
        });
    }

    if (!fs.existsSync(manifestPath)) {
        throw buildCasesFileNotFoundError({
            sheetName,
            schemaName: resolvedSchema,
            attemptedPath: manifestPath,
        });
    }

    return manifestPath;
}