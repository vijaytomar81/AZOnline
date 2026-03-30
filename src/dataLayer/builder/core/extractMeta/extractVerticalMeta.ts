// src/dataLayer/builder/core/extractMeta/extractVerticalMeta.ts

import type ExcelJS from "exceljs";
import { defaultSheetLayoutConfig } from "../sheetLayoutConfig";
import {
    cellToString,
    detectCaseColumns,
    detectLayout,
    findRowByField,
    norm,
} from "../spreadsheet";

type VerticalCaseMeta = {
    col: number;
    scriptId: string;
    scriptName: string;
};

export type VerticalMeta = {
    sheet: string;
    layout: "vertical";
    scriptIdRow: number;
    scriptNameRow: number;
    fieldCol: number;
    caseStartCol: number;
    dataStartRow: number;
    caseMetas: VerticalCaseMeta[];
};

export function extractVerticalMeta(args: {
    ws: ExcelJS.Worksheet;
    sheetName?: string;
}): VerticalMeta {
    const { ws, sheetName } = args;
    const layout = detectLayout(ws);
    const metaAliases = defaultSheetLayoutConfig.metaFieldAliases;

    const scriptIdRow = findRowByField(
        ws,
        layout.fieldCol,
        layout.dataStartRow,
        metaAliases.scriptId
    );

    const scriptNameRow = findRowByField(
        ws,
        layout.fieldCol,
        layout.dataStartRow,
        metaAliases.scriptName
    );

    const caseCols = detectCaseColumns(ws, scriptIdRow, layout.caseStartCol);

    const caseMetas = caseCols.map((col) => ({
        col,
        scriptId: norm(cellToString(ws.getCell(scriptIdRow, col).value)),
        scriptName: norm(cellToString(ws.getCell(scriptNameRow, col).value)),
    }));

    return {
        sheet: String(sheetName ?? ws.name ?? "").trim() || "Sheet",
        layout: "vertical",
        scriptIdRow,
        scriptNameRow,
        fieldCol: layout.fieldCol,
        caseStartCol: layout.caseStartCol,
        dataStartRow: layout.dataStartRow,
        caseMetas,
    };
}