// src/evidenceLayer/artifacts/excel/autoFitExecutionSheetColumns.ts

import ExcelJS from "exceljs";

function measureCell(value: unknown): number {
    return String(value ?? "").length;
}

export function autoFitExecutionSheetColumns(
    worksheet: ExcelJS.Worksheet,
    options: {
        minWidth?: number;
        maxWidth?: number;
    } = {}
): void {
    const minWidth = options.minWidth ?? 12;
    const maxWidth = options.maxWidth ?? 48;

    worksheet.columns.forEach((column) => {
        let width = minWidth;

        column.eachCell?.({ includeEmpty: true }, (cell) => {
            width = Math.max(width, measureCell(cell.value) + 2);
        });

        column.width = Math.min(width, maxWidth);
    });
}
