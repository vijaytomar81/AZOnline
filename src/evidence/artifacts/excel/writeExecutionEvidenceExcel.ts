// src/evidence/artifacts/excel/writeExecutionEvidenceExcel.ts

import fs from "node:fs/promises";
import path from "node:path";
import ExcelJS from "exceljs";
import { autoFitExecutionSheetColumns } from "./autoFitExecutionSheetColumns";
import { buildExecutionExcelRows } from "./buildExecutionExcelRows";
import type { ExecutionCaseRow } from "./buildExecutionItemRows";
import { styleExecutionSheet } from "./styleExecutionSheet";
import { writeExecutionSummarySheet } from "./writeExecutionSummarySheet";

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

function addExecutionDataSheet(
    workbook: ExcelJS.Workbook,
    sheetName: string,
    rows: ExecutionCaseRow[]
): void {
    const worksheet = workbook.addWorksheet(sheetName);

    if (!rows.length) {
        worksheet.columns = [
            { header: "Message", key: "Message", width: 20 },
        ];
        worksheet.addRow({ Message: "No data" });
        worksheet.getRow(1).font = {
            bold: true,
            color: { argb: "FFFFFFFF" },
        };
        worksheet.getCell("A2").font = { italic: true };
        styleExecutionSheet(worksheet, sheetName);
        return;
    }

    worksheet.columns = Object.keys(rows[0]).map((key) => ({
        header: key,
        key,
        width: 18,
    }));

    rows.forEach((row) => worksheet.addRow(row));

    styleExecutionSheet(worksheet, sheetName);
    autoFitExecutionSheetColumns(worksheet, {
        minWidth: 12,
        maxWidth: 48,
    });
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

    writeExecutionSummarySheet(workbook, rows.summaryRows);
    addExecutionDataSheet(workbook, "Passed", rows.passedRows);
    addExecutionDataSheet(workbook, "Failed", rows.failedRows);
    addExecutionDataSheet(workbook, "Not Executed", rows.notExecutedRows);

    await fs.mkdir(input.baseDir, { recursive: true });
    await workbook.xlsx.writeFile(filePath);

    return { filePath };
}
