// src/evidenceLayer/artifacts/excel/writeExecutionEvidenceExcel.ts

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
    notExecutedEvidence?: EvidenceFile;
};

export type WriteExecutionEvidenceExcelResult = {
    filePath: string;
};

function hasVisibleValue(value: unknown): boolean {
    return String(value ?? "").trim() !== "";
}

function pruneEmptyColumns(rows: ExecutionCaseRow[]): ExecutionCaseRow[] {
    if (!rows.length) {
        return rows;
    }

    const keys = Object.keys(rows[0]).filter((key) =>
        rows.some((row) => hasVisibleValue(row[key]))
    );

    return rows.map((row) => {
        const next: ExecutionCaseRow = {};

        keys.forEach((key) => {
            next[key] = row[key];
        });

        return next;
    });
}

function addExecutionDataSheet(
    workbook: ExcelJS.Workbook,
    sheetName: string,
    rows: ExecutionCaseRow[]
): void {
    const worksheet = workbook.addWorksheet(sheetName);

    if (!rows.length) {
        worksheet.columns = [{ header: "Message", key: "Message", width: 20 }];
        worksheet.addRow({ Message: "No data" });
        worksheet.getRow(1).font = {
            bold: true,
            color: { argb: "FFFFFFFF" },
        };
        worksheet.getCell("A2").font = { italic: true };
        styleExecutionSheet(worksheet, sheetName);
        return;
    }

    const cleanedRows = pruneEmptyColumns(rows);

    worksheet.columns = Object.keys(cleanedRows[0]).map((key) => ({
        header: key,
        key,
        width: 18,
    }));

    cleanedRows.forEach((row) => worksheet.addRow(row));

    styleExecutionSheet(worksheet, sheetName);
    autoFitExecutionSheetColumns(worksheet, {
        minWidth: 12,
        maxWidth: 48,
    });
}

function buildSafeTimestamp(value: unknown): string {
    const raw =
        typeof value === "string" && value.trim()
            ? value.trim()
            : new Date().toISOString();

    const digits = raw.replace(/\D/g, "");
    const padded = `${digits}00000000000000`;

    return `${padded.slice(0, 8)}_${padded.slice(8, 14)}`;
}

export async function writeExecutionEvidenceExcel(
    input: WriteExecutionEvidenceExcelInput
): Promise<WriteExecutionEvidenceExcelResult> {
    const workbook = new ExcelJS.Workbook();
    const timestamp = buildSafeTimestamp(
        input.metadata.artifactTimestamp ??
        input.metadata.finishedAt ??
        input.metadata.finalizedAt
    );
    const filePath = path.join(
        input.baseDir,
        `execution-summary_${timestamp}.xlsx`
    );

    const rows = buildExecutionExcelRows({
        runId: input.runId,
        metadata: input.metadata,
        passedEvidence: input.passedEvidence,
        failedEvidence: input.failedEvidence,
        notExecutedEvidence: input.notExecutedEvidence,
    });

    writeExecutionSummarySheet(workbook, rows.summaryRows);
    addExecutionDataSheet(workbook, "Passed", rows.passedRows);
    addExecutionDataSheet(workbook, "Failed", rows.failedRows);
    addExecutionDataSheet(workbook, "Not Executed", rows.notExecutedRows);

    await fs.mkdir(input.baseDir, { recursive: true });
    await workbook.xlsx.writeFile(filePath);

    return { filePath };
}