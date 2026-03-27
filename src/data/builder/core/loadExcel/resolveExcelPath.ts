// src/data/builder/core/loadExcel/resolveExcelPath.ts

import fs from "node:fs";
import path from "node:path";
import { DataBuilderError } from "../../errors";

export function resolveExcelPath(excelPath: string): {
    absExcel: string;
    sizeBytes: number;
} {
    const trimmedPath = String(excelPath ?? "").trim();

    if (!trimmedPath) {
        throw new DataBuilderError({
            code: "EXCEL_PATH_MISSING",
            stage: "load-excel",
            source: "resolveExcelPath",
            message: "Missing excelPath. Provide --excel (or EXCEL_PATH).",
        });
    }

    const absExcel = path.isAbsolute(trimmedPath)
        ? trimmedPath
        : path.join(process.cwd(), trimmedPath);

    if (!fs.existsSync(absExcel)) {
        throw new DataBuilderError({
            code: "EXCEL_FILE_NOT_FOUND",
            stage: "load-excel",
            source: "resolveExcelPath",
            message: `Excel file not found: ${absExcel}`,
            context: {
                excelPath: trimmedPath,
                absExcel,
            },
        });
    }

    const stat = fs.statSync(absExcel);

    if (!stat.isFile()) {
        throw new DataBuilderError({
            code: "EXCEL_PATH_NOT_FILE",
            stage: "load-excel",
            source: "resolveExcelPath",
            message: `Excel path is not a file: ${absExcel}`,
            context: {
                excelPath: trimmedPath,
                absExcel,
            },
        });
    }

    return {
        absExcel,
        sizeBytes: stat.size,
    };
}