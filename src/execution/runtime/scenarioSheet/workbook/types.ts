// src/execution/runtime/scenarioSheet/workbook/types.ts

import type ExcelJS from "exceljs";

export type LoadedWorksheet = {
    workbook: ExcelJS.Workbook;
    worksheet: ExcelJS.Worksheet;
};
