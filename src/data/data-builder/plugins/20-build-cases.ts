// src/data/data-builder/plugins/20-build-cases.ts

import type ExcelJS from "exceljs";
import type { PipelinePlugin } from "../core/pipeline";
import type { DataBuilderContext, BuiltCase, CasesFile } from "../types";

type CaseMeta = {
    col: number;
    scriptId: string;    // from "Script ID" row
    scriptName: string;  // from "ScriptName" row
};

type ExtractedMeta = {
    scriptIdRow: number;
    scriptNameRow: number;
    caseMetas: CaseMeta[];
};

function cellToString(v: any): string {
    if (v === null || v === undefined) return "";
    if (typeof v === "object") {
        // exceljs formula cell
        if ("result" in v) return cellToString((v as any).result);
        // rich text
        if ("richText" in v && Array.isArray((v as any).richText)) {
            return (v as any).richText.map((x: any) => x.text ?? "").join("");
        }
        // hyperlink/text
        if ("text" in v) return String((v as any).text ?? "");
    }
    return String(v);
}

function norm(s: string): string {
    return (s ?? "").trim();
}

function isParentField(label: string): boolean {
    // Your latest rule: parent fields always start with "P__"
    return norm(label).startsWith("P__");
}

function parentName(label: string): string {
    return norm(label).replace(/^P__/, "").trim();
}

function safeSheetFilename(name: string) {
    // safe across Windows/mac/linux
    return name.replace(/[<>:"/\\|?*\x00-\x1F]/g, "_").trim() || "Sheet";
}

const plugin: PipelinePlugin = {
    name: "build-cases",
    order: 20,

    // Graph support (optional, if you are using requires/provides ordering)
    requires: ["sheet", "meta", "external:includeEmptyChildFields"],
    provides: ["casesFile"],

    run: async (ctx: DataBuilderContext) => {
        const ws = ctx.data.sheet as ExcelJS.Worksheet | undefined;
        if (!ws) throw new Error("Sheet missing. Ensure load-excel ran.");

        const meta = ctx.data.meta as ExtractedMeta | undefined;
        if (!meta?.caseMetas?.length) {
            throw new Error("Meta missing/invalid. Ensure extract-meta ran.");
        }

        const includeEmpty = !!ctx.data.includeEmptyChildFields;
        const sheetName = String(ctx.data.sheetName ?? "").trim() || ws.name || "Sheet";
        const absExcel = String(ctx.data.absExcel ?? ctx.data.excelPath ?? "").trim();

        ctx.log.info("Building cases from sheet...");

        const maxRow = ws.rowCount || ws.actualRowCount || 0;

        const built: BuiltCase[] = [];

        // Build each case column (each script)
        for (let i = 0; i < meta.caseMetas.length; i++) {
            const m = meta.caseMetas[i];

            // Level-4 case wrapper
            const data: Record<string, any> = {};

            let currentParent: string | null = null;

            for (let r = 1; r <= maxRow; r++) {
                const label = norm(cellToString(ws.getCell(r, 1).value));
                if (!label) continue;

                // Skip the meta rows themselves so they don't appear in data
                if (r === meta.scriptIdRow || r === meta.scriptNameRow) continue;

                const rawVal = norm(cellToString(ws.getCell(r, m.col).value));

                // Parent starts
                if (isParentField(label)) {
                    currentParent = parentName(label);
                    if (!currentParent) {
                        currentParent = null;
                        continue;
                    }
                    if (data[currentParent] === undefined) data[currentParent] = {};
                    continue;
                }

                // Child inside current parent
                if (currentParent) {
                    if (!includeEmpty && rawVal === "") {
                        // skip empty child values when includeEmptyChildFields is false
                        continue;
                    }
                    // include child always (with empty too) when includeEmpty=true
                    (data[currentParent] as Record<string, any>)[label] = rawVal;
                    continue;
                }

                // Normal (before first parent)
                if (!includeEmpty && rawVal === "") continue;
                data[label] = rawVal;
            }

            // Optional: lift Description if present
            const description =
                typeof data["Description"] === "string" && data["Description"].trim()
                    ? String(data["Description"]).trim()
                    : undefined;

            const one: BuiltCase = {
                caseIndex: i + 1,         // 1-based, left-to-right across case columns
                scriptName: m.scriptName, // unique script key
                scriptId: m.scriptId,     // Script ID row value
                description,
                data,
            };

            built.push(one);
        }

        // Level-4 cases file
        const casesFile: CasesFile = {
            sheet: sheetName,
            sourceExcel: absExcel,
            generatedAt: new Date().toISOString(),
            caseCount: built.length,
            cases: built,
        };

        ctx.data.casesFile = casesFile;

        ctx.log.info(`Cases built: ${built.length}`);
        ctx.log.debug?.(
            `Built casesFile => sheet=${safeSheetFilename(sheetName)} includeEmptyChildFields=${includeEmpty}`
        );
    },
};

export default plugin;