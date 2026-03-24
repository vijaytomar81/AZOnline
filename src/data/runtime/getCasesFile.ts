// src/data/runtime/getCasesFile.ts

import fs from "node:fs";
import path from "node:path";
import { DataBuilderError } from "../builder/errors";
import type { CasesFile } from "../builder/types";
import { resolveSchemaName } from "../data-definitions";
import { ROOT, getGeneratedSchemaDir } from "@utils/paths";
import {
    findGeneratedManifestItem,
    resolveManifestFilePath,
} from "@data/runtime/generatedManifest";

function safeSheetFilename(name: string) {
    return name.replace(/[<>:"/\\|?*\x00-\x1F]/g, "_").trim() || "Sheet";
}

function findLatestJsonFile(dir: string, baseName: string): string | null {
    if (!fs.existsSync(dir)) return null;

    const files = fs
        .readdirSync(dir)
        .filter((file) => {
            if (!file.endsWith(".json")) return false;
            if (file.includes(".validation")) return false;
            return file === `${baseName}.json` || file.startsWith(`${baseName}_`);
        })
        .map((file) => {
            const fullPath = path.join(dir, file);
            return {
                fullPath,
                mtimeMs: fs.statSync(fullPath).mtimeMs,
            };
        })
        .sort((a, b) => b.mtimeMs - a.mtimeMs);

    return files[0]?.fullPath ?? null;
}

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

    const manifestPath = resolveManifestFilePath(item);
    if (!manifestPath) return null;

    return fs.existsSync(manifestPath) ? manifestPath : null;
}

function resolveGeneratedCasesFile(
    sheetName: string,
    schemaName: string
): string {
    const dir = getGeneratedSchemaDir(schemaName);
    const baseName = safeSheetFilename(sheetName);

    const exactPath = path.join(dir, `${baseName}.json`);
    if (fs.existsSync(exactPath)) {
        return exactPath;
    }

    const latestPath = findLatestJsonFile(dir, baseName);
    if (latestPath) {
        return latestPath;
    }

    return exactPath;
}

function buildCasesFileNotFoundError(args: {
    sheetName: string;
    schemaName: string;
    attemptedPath: string;
}): DataBuilderError {
    const manifestItem = findGeneratedManifestItem({
        sheetName: args.sheetName,
        schemaName: args.schemaName,
    });

    const messageLines: string[] = [
        "No generated data JSON found.",
        "",
        `Sheet   : ${args.sheetName}`,
        `Schema  : ${args.schemaName}`,
        "",
    ];

    if (manifestItem) {
        messageLines.push("Last generated entry (from index.json):");
        messageLines.push(`  File         : ${manifestItem.filePath}`);

        if (manifestItem.validationReportPath) {
            messageLines.push(
                `  Validation   : ${manifestItem.validationReportPath}`
            );
        }

        messageLines.push(`  Case Count   : ${manifestItem.caseCount}`);
        messageLines.push(`  Generated At : ${manifestItem.generatedAt}`);
        messageLines.push("");
        messageLines.push("The manifest entry exists, but the file is missing on disk.");
        messageLines.push("");
    } else {
        messageLines.push("No matching entry found in generated index.json.");
        messageLines.push("");
    }

    messageLines.push("Attempted path:");
    messageLines.push(`  ${args.attemptedPath}`);
    messageLines.push("");
    messageLines.push("Next step:");
    messageLines.push(
        `  npm run data:build -- --excel <path> --sheet "${args.sheetName}"`
    );

    return new DataBuilderError({
        code: "CASES_FILE_NOT_FOUND",
        stage: "load-cases-file",
        source: "getCasesFile",
        message: messageLines.join("\n"),
        context: {
            sheetName: args.sheetName,
            schemaName: args.schemaName,
            filePath: args.attemptedPath,
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
    if (manifestPath) {
        return manifestPath;
    }

    return resolveGeneratedCasesFile(sheetName, resolvedSchema);
}

export function getCasesFile(sheetName: string, schemaName?: string): CasesFile {
    const resolvedSchema = resolveSchemaName(
        schemaName || process.env.SCHEMA,
        sheetName
    );

    const filePath = resolveCasesFilePath(sheetName, resolvedSchema);

    if (!fs.existsSync(filePath)) {
        throw buildCasesFileNotFoundError({
            sheetName,
            schemaName: resolvedSchema,
            attemptedPath: filePath,
        });
    }

    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as CasesFile;
}