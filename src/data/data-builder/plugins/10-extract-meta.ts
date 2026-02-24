// src/data/data-builder/plugins/10-extract-meta.ts

import type ExcelJS from "exceljs";
import type { PipelinePlugin } from "../core/pipeline";

export type CaseMeta = {
    col: number;
    scriptId: string;
    scriptName: string;
};

export type ExtractedMeta = {
    scriptIdRow: number;
    scriptNameRow: number;
    caseMetas: CaseMeta[];
};

function cellToString(v: any): string {
    if (v === null || v === undefined) return "";
    if (typeof v === "object") {
        if ("result" in v) return cellToString((v as any).result);
        if ("text" in v) return String((v as any).text ?? "");
        if ("richText" in v && Array.isArray((v as any).richText)) {
            return (v as any).richText.map((x: any) => x.text ?? "").join("");
        }
    }
    return String(v);
}

function norm(s: string): string {
    return (s ?? "").trim();
}

function normKey(s: string): string {
    return norm(s).toLowerCase().replace(/\s+/g, "");
}

function findRowByLabel(ws: ExcelJS.Worksheet, label: string): number {
    const target = normKey(label);
    const maxRow = ws.rowCount || ws.actualRowCount || 0;

    for (let r = 1; r <= maxRow; r++) {
        const a = norm(cellToString(ws.getCell(r, 1).value));
        if (!a) continue;
        if (normKey(a) === target) return r;
    }

    throw new Error(`Row "${label}" not found in Column A`);
}

function detectCaseColumns(ws: ExcelJS.Worksheet, scriptIdRow: number): number[] {
    const cols: number[] = [];
    const maxCol = ws.columnCount || ws.actualColumnCount || 0;

    // Start from column B (2) until Script ID cell becomes empty
    for (let c = 2; c <= maxCol; c++) {
        const id = norm(cellToString(ws.getCell(scriptIdRow, c).value));
        if (!id) break;
        cols.push(c);
    }

    if (cols.length === 0) {
        throw new Error(
            "No case columns found (Script ID row has no values from column B onward)."
        );
    }

    return cols;
}

const plugin: PipelinePlugin = {
    name: "extract-meta",

    requires: ["sheet"],

    provides: ["meta"],

    run: async (ctx) => {
        const ws = ctx.data.sheet as ExcelJS.Worksheet | undefined;
        if (!ws) throw new Error("Sheet not loaded. Ensure load-excel plugin ran.");

        ctx.log.info("Extracting Script ID / ScriptName metadata...");

        const scriptIdRow = findRowByLabel(ws, "Script ID");
        const scriptNameRow = findRowByLabel(ws, "ScriptName");

        const caseCols = detectCaseColumns(ws, scriptIdRow);

        const metas: CaseMeta[] = [];
        const seenIds = new Map<string, number>();
        const seenNames = new Map<string, number>();

        for (const col of caseCols) {
            const scriptId = norm(cellToString(ws.getCell(scriptIdRow, col).value));
            const scriptName = norm(cellToString(ws.getCell(scriptNameRow, col).value));

            if (!scriptId) throw new Error(`Empty Script ID at row ${scriptIdRow}, col ${col}`);
            if (!scriptName) {
                throw new Error(
                    `Empty ScriptName at row ${scriptNameRow}, col ${col} (Script ID: ${scriptId})`
                );
            }

            // Hard stop duplicates (requirement from you)
            if (seenIds.has(scriptId)) {
                throw new Error(
                    `Duplicate Script ID "${scriptId}" found (cols ${seenIds.get(scriptId)} and ${col}).`
                );
            }
            if (seenNames.has(scriptName)) {
                throw new Error(
                    `Duplicate ScriptName "${scriptName}" found (cols ${seenNames.get(scriptName)} and ${col}).`
                );
            }

            seenIds.set(scriptId, col);
            seenNames.set(scriptName, col);
            metas.push({ col, scriptId, scriptName });
        }

        const meta: ExtractedMeta = {
            scriptIdRow,
            scriptNameRow,
            caseMetas: metas,
        };

        // Store meta in ctx.data (single key produced by this plugin)
        ctx.data.meta = {
            sheet: String(ctx.data.sheetName ?? ws.name ?? "").trim() || "Sheet",
            scriptIdRow: meta.scriptIdRow,
            scriptNameRow: meta.scriptNameRow,
            caseMetas: meta.caseMetas,
        };

        ctx.log.info(`Metadata extracted. Cases detected: ${metas.length}`);
        ctx.log.debug?.(`Script ID row: ${scriptIdRow}, ScriptName row: ${scriptNameRow}`);
    },
};

export default plugin;