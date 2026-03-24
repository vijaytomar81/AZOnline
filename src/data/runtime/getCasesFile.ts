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
    const filePath = resolveCasesFilePath(sheetName, schemaName);

    if (!fs.existsSync(filePath)) {
        throw new DataBuilderError({
            code: "CASES_FILE_NOT_FOUND",
            stage: "load-cases-file",
            source: "getCasesFile",
            message: `Test data JSON not found: ${filePath}`,
            context: {
                sheetName,
                schemaName: schemaName ?? "",
                filePath,
            },
        });
    }

    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as CasesFile;
}