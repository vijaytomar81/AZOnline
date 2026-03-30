// src/dataLayer/builder/core/writeJson/resolveWriteJsonInputs.ts

import type { CasesFile } from "../../types";
import { DataBuilderError } from "../../errors";

export function resolveWriteJsonInputs(args: {
    casesFile?: CasesFile;
    sheetName?: string;
    schemaName?: string;
}): {
    casesFile: CasesFile;
    sheetName: string;
    schemaName: string;
} {
    const casesFile = args.casesFile;

    if (!casesFile) {
        throw new DataBuilderError({
            code: "CASES_FILE_MISSING",
            stage: "write-json",
            source: "resolveWriteJsonInputs",
            message: "casesFile missing. build-cases must run before write-json.",
        });
    }

    const sheetName = String(casesFile.sheet ?? args.sheetName ?? "").trim();
    if (!sheetName) {
        throw new DataBuilderError({
            code: "SHEET_NAME_MISSING",
            stage: "write-json",
            source: "resolveWriteJsonInputs",
            message: "sheetName missing.",
        });
    }

    const schemaName = String(args.schemaName ?? "").trim();
    if (!schemaName) {
        throw new DataBuilderError({
            code: "SCHEMA_NAME_MISSING",
            stage: "write-json",
            source: "resolveWriteJsonInputs",
            message: "schemaName missing. Ensure schema is resolved before write-json.",
        });
    }

    return {
        casesFile,
        sheetName,
        schemaName,
    };
}