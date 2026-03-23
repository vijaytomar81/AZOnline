// src/execution/runtime/loadScenarioSheet.ts

import path from "node:path";
import ExcelJS from "exceljs";
import { fileExists } from "../../utils/fs";
import { normalizeSpaces } from "../../utils/text";
import type { Logger } from "../../utils/logger";
import { defaultScenarioTemplateConfig } from "../scenario/templateConfig";
import { validateScenarioTemplateHeaders } from "../scenario/templateValidator";
import type { RawScenarioRow } from "../scenario/types";

export type LoadScenarioSheetResult = {
    sheetName: string;
    headers: string[];
    rows: RawScenarioRow[];
};

function cellToString(value: unknown): string {
    if (value === null || value === undefined) return "";
    if (typeof value === "object") {
        const obj = value as Record<string, unknown>;
        if ("result" in obj) return cellToString(obj.result);
        if ("text" in obj) return String(obj.text ?? "");
    }
    return String(value);
}

function normKey(value: unknown): string {
    return normalizeSpaces(String(value ?? ""))
        .toLowerCase()
        .replace(/\s+/g, "");
}

function buildCanonicalHeaders(): Map<string, string> {
    const cfg = defaultScenarioTemplateConfig;
    const map = new Map<string, string>();

    const baseHeaders = [
        ...cfg.requiredBaseHeaders,
        ...cfg.conditionalBaseHeaders.existingPolicy,
        ...cfg.conditionalBaseHeaders.newBusiness,
    ];

    baseHeaders.forEach((header) => map.set(normKey(header), header));

    for (let stepNo = 1; stepNo <= cfg.maxSteps; stepNo++) {
        cfg.stepFieldSuffixes.forEach((suffix) => {
            const header = `Step${stepNo}${suffix}`;
            map.set(normKey(header), header);
        });
    }

    return map;
}

function getHeaders(ws: ExcelJS.Worksheet): string[] {
    const maxCol = ws.columnCount || ws.actualColumnCount || 0;
    return Array.from({ length: maxCol }, (_, idx) =>
        normalizeSpaces(cellToString(ws.getCell(1, idx + 1).value))
    );
}

function isEmptyRow(values: string[]): boolean {
    return values.every((value) => !normalizeSpaces(value));
}

export async function loadScenarioSheet(args: {
    excelPath: string;
    sheetName: string;
    log?: Logger;
}): Promise<LoadScenarioSheetResult> {
    const absExcel = path.isAbsolute(args.excelPath)
        ? args.excelPath
        : path.join(process.cwd(), args.excelPath);

    if (!fileExists(absExcel)) {
        throw new Error(`Execution Excel file not found: ${absExcel}`);
    }

    args.log?.info(`Loading execution workbook: ${absExcel}`);

    const wb = new ExcelJS.Workbook();
    await wb.xlsx.readFile(absExcel);

    const ws = wb.getWorksheet(args.sheetName);
    if (!ws) {
        const names = wb.worksheets.map((item) => item.name).join(", ");
        throw new Error(`Sheet "${args.sheetName}" not found. Available: ${names}`);
    }

    args.log?.debug(`Workbook sheets: ${wb.worksheets.map((item) => item.name).join(", ")}`);

    const rawHeaders = getHeaders(ws);
    const headerErrors = validateScenarioTemplateHeaders(rawHeaders);
    if (headerErrors.length) {
        throw new Error(`Execution sheet header validation failed\n${headerErrors.join("\n")}`);
    }

    const canonicalHeaders = buildCanonicalHeaders();
    const headers = rawHeaders.map((header) => canonicalHeaders.get(normKey(header)) ?? header);
    const rows: RawScenarioRow[] = [];
    const maxRow = ws.rowCount || ws.actualRowCount || 0;

    for (let rowNo = 2; rowNo <= maxRow; rowNo++) {
        const values = headers.map((_, idx) =>
            normalizeSpaces(cellToString(ws.getCell(rowNo, idx + 1).value))
        );

        if (isEmptyRow(values)) continue;

        const row: RawScenarioRow = { ScenarioId: "" };
        headers.forEach((header, idx) => {
            if (!header) return;
            row[header] = values[idx];
        });

        rows.push(row);
    }

    args.log?.info(`Loaded execution sheet: ${ws.name}`);
    args.log?.info(`Scenario rows loaded: ${rows.length}`);
    args.log?.debug(`Headers: ${headers.filter(Boolean).join(", ")}`);

    return {
        sheetName: ws.name,
        headers,
        rows,
    };
}