// src/data/runtime/getCasesFile.ts

import fs from "node:fs";
import path from "node:path";
import { DataBuilderError } from "../builder/errors";
import type { CasesFile } from "../builder/types";
import { resolveSchemaName } from "../data-definitions";
import { ROOT } from "@utils/paths";
import {
    findGeneratedManifestItem,
    resolveManifestFilePath,
} from "@data/runtime/generatedManifest";

function resolveExplicitCasesFile(): string | null {
    const explicit = String(process.env.CASES_FILE ?? "").trim();
    if (!explicit) return null;

    return path.isAbsolute(explicit) ? explicit : path.join(ROOT, explicit);
}

function resolveManifestCasesFile(
    sheetName: string,
    schemaName: string
): string | null {
    const item = findGeneratedManifestItem({
        sheetName,
        schemaName,
    });

    return resolveManifestFilePath(item);
}

function buildCasesFileNotFoundError(args: {
    sheetName: string;
    schemaName: string;
    attemptedPath?: string;
}): DataBuilderError {
    const manifestItem = findGeneratedManifestItem({
        sheetName: args.sheetName,
        schemaName: args.schemaName,
    });

    const lines: string[] = [
        "No generated data JSON found via manifest.",
        "",
        `Sheet   : ${args.sheetName}`,
        `Schema  : ${args.schemaName}`,
        "",
    ];

    if (manifestItem) {
        lines.push("Manifest entry found:");
        lines.push(`  Key          : ${manifestItem.key}`);
        lines.push(`  File         : ${manifestItem.filePath}`);

        if (manifestItem.validationReportPath) {
            lines.push(`  Validation   : ${manifestItem.validationReportPath}`);
        }

        lines.push(`  Case Count   : ${manifestItem.caseCount}`);
        lines.push(`  Generated At : ${manifestItem.generatedAt}`);
        lines.push("");

        if (args.attemptedPath) {
            lines.push("The manifest entry exists, but the file is missing on disk:");
            lines.push(`  ${args.attemptedPath}`);
            lines.push("");
        }
    } else {
        lines.push("No matching entry found in generated index.json.");
        lines.push("");
    }

    lines.push("Next step:");
    lines.push(
        `  npm run data:build -- --excel <path> --sheet "${args.sheetName}"`
    );

    return new DataBuilderError({
        code: "CASES_FILE_NOT_FOUND",
        stage: "load-cases-file",
        source: "getCasesFile",
        message: lines.join("\n"),
        context: {
            sheetName: args.sheetName,
            schemaName: args.schemaName,
            filePath: args.attemptedPath ?? "",
            manifestKey: manifestItem?.key ?? "",
            manifestFilePath: manifestItem?.filePath ?? "",
            manifestGeneratedAt: manifestItem?.generatedAt ?? "",
        },
    });
}

export function resolveCasesFilePath(
    sheetName: string,
    schemaName?: string
): string {
    const explicitPath = resolveExplicitCasesFile();
    if (explicitPath) {
        return explicitPath;
    }

    const resolvedSchema = resolveSchemaName(
        schemaName || process.env.SCHEMA,
        sheetName
    );

    const manifestPath = resolveManifestCasesFile(sheetName, resolvedSchema);
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

export function getCasesFile(sheetName: string, schemaName?: string): CasesFile {
    const resolvedSchema = resolveSchemaName(
        schemaName || process.env.SCHEMA,
        sheetName
    );

    const filePath = resolveCasesFilePath(sheetName, resolvedSchema);
    const raw = fs.readFileSync(filePath, "utf-8");

    return JSON.parse(raw) as CasesFile;
}