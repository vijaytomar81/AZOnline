// src/execution/runtime/scenarioSheet/workbook/readWorkbook.ts

import ExcelJS from "exceljs";
import { AppError } from "@utils/errors";

export async function readWorkbook(absExcel: string): Promise<ExcelJS.Workbook> {
    const workbook = new ExcelJS.Workbook();

    try {
        await workbook.xlsx.readFile(absExcel);
        return workbook;
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);

        throw new AppError({
            code: "EXECUTION_WORKBOOK_READ_FAILED",
            stage: "load-scenario-sheet",
            source: "excelSheetLoader",
            message: `Failed to read execution workbook "${absExcel}": ${message}`,
            context: { absExcel },
        });
    }
}
