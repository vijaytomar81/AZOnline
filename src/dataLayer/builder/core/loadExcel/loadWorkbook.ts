// src/dataLayer/builder/core/loadExcel/loadWorkbook.ts

import ExcelJS from "exceljs";
import { DataBuilderError } from "../../errors";

export async function loadWorkbook(absExcel: string): Promise<ExcelJS.Workbook> {
    const workbook = new ExcelJS.Workbook();

    try {
        await workbook.xlsx.readFile(absExcel);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);

        throw new DataBuilderError({
            code: "WORKBOOK_READ_FAILED",
            stage: "load-excel",
            source: "loadWorkbook",
            message: `Failed to read Excel workbook "${absExcel}": ${message}`,
            context: {
                absExcel,
            },
        });
    }

    const worksheetCount = Array.isArray(workbook.worksheets)
        ? workbook.worksheets.length
        : 0;

    if (!worksheetCount) {
        throw new DataBuilderError({
            code: "NO_WORKSHEETS_FOUND",
            stage: "load-excel",
            source: "loadWorkbook",
            message: `Workbook loaded but no worksheets were found in: ${absExcel}`,
            context: {
                absExcel,
            },
        });
    }

    return workbook;
}