// src/data/runtime/getCasesFile.ts

import fs from "node:fs";
import { resolveSchemaName } from "../data-definitions";
import type { CasesFile } from "../builder/types";
import { resolveCasesFilePath } from "./resolveCasesFilePath";

export function getCasesFile(
    sheetName: string,
    schemaName?: string
): CasesFile {
    const resolvedSchema = resolveSchemaName(
        schemaName || process.env.SCHEMA,
        sheetName
    );

    const filePath = resolveCasesFilePath(sheetName, resolvedSchema);
    const raw = fs.readFileSync(filePath, "utf-8");

    return JSON.parse(raw) as CasesFile;
}