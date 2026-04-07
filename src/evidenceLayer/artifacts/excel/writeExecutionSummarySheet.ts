// src/evidence/artifacts/excel/writeExecutionSummarySheet.ts

import ExcelJS from "exceljs";
import type { SummaryRow } from "./buildExecutionSummaryRows";

export function writeExecutionSummarySheet(
    workbook: ExcelJS.Workbook,
    rows: SummaryRow[]
): void {
    const sheet = workbook.addWorksheet("Summary");

    sheet.columns = [
        { header: "Field", key: "Field", width: 28 },
        { header: "Value", key: "Value", width: 70 },
    ];

    rows.forEach((row) => {
        const r = sheet.addRow({ Field: row.Field, Value: row.Value });

        if (row.kind === "title") {
            sheet.mergeCells(`A${r.number}:B${r.number}`);
            const cell = sheet.getCell(`A${r.number}`);
            cell.font = { bold: true, size: 16, color: { argb: "FFFFFFFF" } };
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "1F4E78" } };
            cell.alignment = { horizontal: "center" };
            return;
        }

        if (row.kind === "section") {
            sheet.mergeCells(`A${r.number}:B${r.number}`);
            const cell = sheet.getCell(`A${r.number}`);
            cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "5B7DB1" } };
            return;
        }

        if (row.kind === "spacer") return;

        const fieldCell = sheet.getCell(`A${r.number}`);
        fieldCell.font = { bold: true };

        if (row.Field === "Passed") {
            sheet.getCell(`B${r.number}`).font = { bold: true, color: { argb: "FF2E7D32" } };
        }

        if (row.Field === "Failed") {
            sheet.getCell(`B${r.number}`).font = { bold: true, color: { argb: "FFC62828" } };
        }

        if (row.Field === "Not Executed") {
            sheet.getCell(`B${r.number}`).font = { bold: true, color: { argb: "FFEF6C00" } };
        }
    });
}
