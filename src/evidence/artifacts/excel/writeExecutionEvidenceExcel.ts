// src/evidence/artifacts/excel/writeExecutionEvidenceExcel.ts

import fs from "node:fs/promises";
import path from "node:path";
import ExcelJS from "exceljs";
import { buildExecutionExcelRows } from "./buildExecutionExcelRows";

type EvidenceCase = Record<string, unknown>;
type EvidenceFile = {
    runId: string;
    cases: Record<string, EvidenceCase>;
};

export type WriteExecutionEvidenceExcelInput = {
    runId: string;
    baseDir: string;
    metadata: Record<string, unknown>;
    passedEvidence: EvidenceFile;
    failedEvidence?: EvidenceFile;
};

export type WriteExecutionEvidenceExcelResult = {
    filePath: string;
};

function getHeaderColor(sheetName: string): string {
    switch (sheetName) {
        case "Summary":
            return "1F4E78";
        case "Passed":
            return "2E7D32";
        case "Failed":
            return "C62828";
        case "Not Executed":
            return "EF6C00";
        default:
            return "4F81BD";
    }
}

function styleHeaderRow(
    worksheet: ExcelJS.Worksheet,
    sheetName: string
): void {
    const headerColor = getHeaderColor(sheetName);

    worksheet.getRow(1).eachCell((cell) => {
        cell.font = {
            bold: true,
            color: { argb: "FFFFFFFF" },
        };
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: headerColor },
        };
        cell.alignment = {
            vertical: "middle",
            horizontal: "center",
        };
        cell.border = {
            top: { style: "thin", color: { argb: "FFBFBFBF" } },
            left: { style: "thin", color: { argb: "FFBFBFBF" } },
            bottom: { style: "thin", color: { argb: "FFBFBFBF" } },
            right: { style: "thin", color: { argb: "FFBFBFBF" } },
        };
    });
}

function addSheetFromRows<T extends Record<string, unknown>>(
    workbook: ExcelJS.Workbook,
    sheetName: string,
    rows: T[]
): void {
    const worksheet = workbook.addWorksheet(sheetName);

    if (!rows.length) {
        worksheet.addRow(["No data"]);
        worksheet.getRow(1).font = { italic: true };
        return;
    }

    const columns = Object.keys(rows[0]).map((key) => ({
        header: key,
        key,
        width: Math.max(16, key.length + 2),
    }));

    worksheet.columns = columns;
    rows.forEach((row) => worksheet.addRow(row));

    styleHeaderRow(worksheet, sheetName);
    worksheet.views = [{ state: "frozen", ySplit: 1 }];
    worksheet.autoFilter = {
        from: "A1",
        to: `${worksheet.getRow(1).cellCount > 0
            ? worksheet.getRow(1).getCell(worksheet.getRow(1).cellCount).address
            : "A1"}`
    };
}

export async function writeExecutionEvidenceExcel(
    input: WriteExecutionEvidenceExcelInput
): Promise<WriteExecutionEvidenceExcelResult> {
    const workbook = new ExcelJS.Workbook();
    const filePath = path.join(input.baseDir, "execution-summary.xlsx");

    const rows = buildExecutionExcelRows({
        runId: input.runId,
        metadata: input.metadata,
        passedEvidence: input.passedEvidence,
        failedEvidence: input.failedEvidence,
    });

    addSheetFromRows(workbook, "Summary", rows.summaryRows);
    addSheetFromRows(workbook, "Passed", rows.passedRows);
    addSheetFromRows(workbook, "Failed", rows.failedRows);
    addSheetFromRows(workbook, "Not Executed", rows.notExecutedRows);

    await fs.mkdir(input.baseDir, { recursive: true });
    await workbook.xlsx.writeFile(filePath);

    return { filePath };
}
