// src/data/runtime/getCasesFile.ts

import fs from "node:fs";
import path from "node:path";
import { DataBuilderError } from "../builder/errors";
import type { CasesFile } from "../builder/types";
import { resolveSchemaName } from "../data-definitions";
import { ROOT, getGeneratedSchemaDir } from "@utils/paths";

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

export function resolveCasesFilePath(sheetName: string, schemaName?: string): string {
    const explicit = String(process.env.CASES_FILE ?? "").trim();
    if (explicit) {
        return path.isAbsolute(explicit) ? explicit : path.join(ROOT, explicit);
    }

    const resolvedSchema = resolveSchemaName(schemaName || process.env.SCHEMA, sheetName);
    const dir = getGeneratedSchemaDir(resolvedSchema);
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