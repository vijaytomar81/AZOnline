// src/data/runtime/getCasesFile.ts

import fs from "node:fs";
import path from "node:path";
import type { CasesFile } from "../builder/types";
import { resolveSchemaName } from "../data-definitions";
import { DataBuilderError } from "../builder/errors";
import { toKebabFromSnake } from "../../utils/text";

function safeSheetFilename(name: string) {
    return name.replace(/[<>:"/\\|?*\x00-\x1F]/g, "_").trim() || "Sheet";
}

export function resolveCasesFilePath(sheetName: string, schemaName?: string): string {
    const explicit = String(process.env.CASES_FILE ?? "").trim();
    if (explicit) {
        return path.isAbsolute(explicit) ? explicit : path.join(process.cwd(), explicit);
    }

    const resolvedSchema = resolveSchemaName(
        schemaName || process.env.SCHEMA,
        sheetName
    );

    return path.join(
        process.cwd(),
        "src",
        "data",
        "generated",
        "new-business",
        toKebabFromSnake(resolvedSchema),
        `${safeSheetFilename(sheetName)}.json`
    );
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