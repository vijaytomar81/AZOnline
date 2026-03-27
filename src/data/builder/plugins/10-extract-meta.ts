// src/data/builder/plugins/10-extract-meta.ts

import type ExcelJS from "exceljs";
import type { PipelinePlugin } from "../core/pipeline";
import { defaultSheetLayoutConfig } from "../core/sheetLayoutConfig";
import {
    cellToString,
    detectCaseColumns,
    detectLayout,
    findRowByField,
    norm,
} from "../core/excelRuntime";
import { normalizeHeaderKey, normalizeSpaces } from "@utils/text";
import { DataBuilderError } from "../errors";
import { createLogEvent, logEvent } from "@logging/log";
import { LOG_CATEGORIES } from "@logging/core/logCategories";
import { LOG_LEVELS } from "@logging/core/logLevels";

function emitLog(args: {
    scope: string;
    level: "debug" | "info" | "warn" | "error";
    message: string;
}): void {
    logEvent(
        createLogEvent({
            level: args.level,
            category: LOG_CATEGORIES.TECHNICAL,
            message: args.message,
            scope: args.scope,
        })
    );
}

function getHeaderRow(ws: ExcelJS.Worksheet, rowNo: number): string[] {
    const maxCol = ws.columnCount || ws.actualColumnCount || 0;

    return Array.from({ length: maxCol }, (_, idx) =>
        normalizeSpaces(cellToString(ws.getCell(rowNo, idx + 1).value))
    ).filter(Boolean);
}

function detectTabularCaseMetas(
    ws: ExcelJS.Worksheet,
    testCaseIdCol: number
): Array<{ row: number; scriptId: string; scriptName: string }> {
    const out: Array<{ row: number; scriptId: string; scriptName: string }> = [];
    const maxRow = ws.rowCount || ws.actualRowCount || 0;

    for (let r = 2; r <= maxRow; r++) {
        const testCaseId = norm(cellToString(ws.getCell(r, testCaseIdCol).value));
        if (!testCaseId) continue;

        out.push({
            row: r,
            scriptId: testCaseId,
            scriptName: testCaseId,
        });
    }

    return out;
}

function tryExtractTabularMeta(ws: ExcelJS.Worksheet) {
    const headers = getHeaderRow(ws, 1);
    const headerMap = new Map(
        headers.map((header, idx) => [normalizeHeaderKey(header), idx + 1])
    );

    const testCaseIdCol = headerMap.get(normalizeHeaderKey("TestCaseId"));
    if (!testCaseIdCol) {
        return null;
    }

    const caseMetas = detectTabularCaseMetas(ws, testCaseIdCol);

    return {
        sheet: String(ws.name ?? "").trim() || "Sheet",
        layout: "tabular" as const,
        dataStartRow: 2,
        caseMetas,
        tabularHeaders: headers,
    };
}

const plugin: PipelinePlugin = {
    name: "extract-meta",
    requires: ["sheet"],
    provides: ["meta"],

    run: async (ctx) => {
        const ws = ctx.data.sheet as ExcelJS.Worksheet | undefined;
        const scope = ctx.logScope;
        const verbose = !!ctx.data.verbose;

        if (!ws) {
            throw new DataBuilderError({
                code: "SHEET_NOT_LOADED",
                stage: "extract-meta",
                source: "10-extract-meta",
                message: "Sheet not loaded. Ensure load-excel ran.",
            });
        }

        const tabularMeta = tryExtractTabularMeta(ws);
        if (tabularMeta) {
            ctx.data.meta = tabularMeta;

            emitLog({
                scope,
                level: LOG_LEVELS.INFO,
                message: `Metadata extracted. Cases detected: ${tabularMeta.caseMetas.length}`,
            });

            if (verbose) {
                emitLog({
                    scope,
                    level: LOG_LEVELS.DEBUG,
                    message: "Detected layout -> tabular",
                });
                emitLog({
                    scope,
                    level: LOG_LEVELS.DEBUG,
                    message: `Tabular headers -> ${tabularMeta.tabularHeaders?.join(", ") ?? ""}`,
                });

                tabularMeta.caseMetas.forEach((m) => {
                    emitLog({
                        scope,
                        level: LOG_LEVELS.DEBUG,
                        message: `Case meta -> row=${m.row}, scriptId=${m.scriptId}, scriptName=${m.scriptName}`,
                    });
                });
            }

            return;
        }

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

        ctx.data.meta = {
            sheet: String(ctx.data.sheetName ?? ws.name ?? "").trim() || "Sheet",
            layout: "vertical",
            scriptIdRow,
            scriptNameRow,
            fieldCol: layout.fieldCol,
            caseStartCol: layout.caseStartCol,
            dataStartRow: layout.dataStartRow,
            caseMetas,
        };

        emitLog({
            scope,
            level: LOG_LEVELS.INFO,
            message: `Metadata extracted. Cases detected: ${caseMetas.length}`,
        });

        if (verbose) {
            emitLog({
                scope,
                level: LOG_LEVELS.DEBUG,
                message: "Detected layout -> vertical",
            });
            emitLog({
                scope,
                level: LOG_LEVELS.DEBUG,
                message: `Detected layout -> dataStartRow=${layout.dataStartRow}`,
            });
            emitLog({
                scope,
                level: LOG_LEVELS.DEBUG,
                message: `Detected layout -> fieldCol=${layout.fieldCol}`,
            });
            emitLog({
                scope,
                level: LOG_LEVELS.DEBUG,
                message: `Detected layout -> caseStartCol=${layout.caseStartCol}`,
            });
            emitLog({
                scope,
                level: LOG_LEVELS.DEBUG,
                message: `ScriptId row=${scriptIdRow}`,
            });
            emitLog({
                scope,
                level: LOG_LEVELS.DEBUG,
                message: `ScriptName row=${scriptNameRow}`,
            });
            emitLog({
                scope,
                level: LOG_LEVELS.DEBUG,
                message: `Case columns detected=${caseCols.length}`,
            });

            caseMetas.forEach((m) => {
                emitLog({
                    scope,
                    level: LOG_LEVELS.DEBUG,
                    message: `Case meta -> col=${m.col}, scriptId=${m.scriptId}, scriptName=${m.scriptName}`,
                });
            });
        }
    },
};

export default plugin;