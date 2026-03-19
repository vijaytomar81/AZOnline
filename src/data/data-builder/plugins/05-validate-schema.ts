// src/data/data-builder/plugins/05-validate-schema.ts

import type ExcelJS from "exceljs";
import type { PipelinePlugin } from "../core/pipeline";
import type { ValidationReport } from "../types";
import { getSchema } from "../../input-data-schema";
import {
    buildRowIndex,
    cellToString,
    detectLayout,
    norm,
    normKey,
} from "../core/excelRuntime";

function collectSchemaFields(obj: any, out: Set<string>) {
    if (!obj || typeof obj !== "object") return;
    for (const value of Object.values(obj)) {
        if (typeof value === "string") out.add(value);
        else if (typeof value === "object") collectSchemaFields(value, out);
    }
}

function collectExcelFields(ws: ExcelJS.Worksheet, fieldCol: number, dataStartRow: number) {
    const rows = buildRowIndex(ws, fieldCol, dataStartRow);
    const duplicates: string[] = [];
    const seen = new Set<string>();
    const maxRow = ws.rowCount || ws.actualRowCount || 0;

    for (let r = dataStartRow; r <= maxRow; r++) {
        const raw = norm(cellToString(ws.getCell(r, fieldCol).value));
        if (!raw) continue;
        const key = normKey(raw);
        if (seen.has(key)) duplicates.push(raw);
        seen.add(key);
    }

    return { rows, duplicates };
}

function missingFields(rows: Map<string, number>, fields: Iterable<string>) {
    return [...fields].filter((f) => !rows.has(normKey(f)));
}

const plugin: PipelinePlugin = {
    name: "validate-schema",
    order: 5,
    requires: ["sheet", "external:schemaName", "external:strictValidation"],
    provides: ["validationReport"],

    run: async (ctx) => {
        const ws = ctx.data.sheet as ExcelJS.Worksheet;
        const strict = !!ctx.data.strictValidation;
        const schema = getSchema(ctx.data.schemaName);

        const layout = detectLayout(ws);
        const { rows, duplicates } = collectExcelFields(
            ws,
            layout.fieldCol,
            layout.dataStartRow
        );

        // ---- Schema fields
        const schemaFields = new Set<string>();
        collectSchemaFields(schema.groups, schemaFields);

        for (const rep of Object.values(schema.repeatedGroups ?? {})) {
            schemaFields.add(rep.countField);
            collectSchemaFields(rep.groups, schemaFields);
        }

        // ---- Validation buckets
        const requiredMissing = missingFields(rows, schema.requiredFields ?? []);
        const mappedMissing = missingFields(rows, schemaFields);

        const excelFields = new Set([...rows.keys()]);
        const schemaFieldKeys = new Set([...schemaFields].map(normKey));

        const unmappedExcel = [...excelFields].filter((f) => !schemaFieldKeys.has(f));

        // ---- Build report
        const errors: string[] = [];
        const warnings: string[] = [];
        const info: string[] = [];

        // Errors (ONLY critical)
        requiredMissing.forEach((f) =>
            errors.push(`Missing required field: ${f}`)
        );

        if (strict) {
            duplicates.forEach((f) =>
                errors.push(`Duplicate Excel field: ${f}`)
            );
        }

        // Warnings
        mappedMissing.forEach((f) =>
            warnings.push(`Missing mapped field: ${f}`)
        );

        // Info
        unmappedExcel.forEach((f) =>
            info.push(`Unused Excel field: ${f}`)
        );

        // ✅ FIX: properly typed mode
        const mode: "normal" | "strict" = strict ? "strict" : "normal";

        const report: ValidationReport = {
            schemaName: ctx.data.schemaName,
            sheetName: ctx.data.sheetName,
            mode,

            errors,
            warnings,
            info,

            schemaToExcel: {
                requiredMissing,
                mappedMissing,
            },

            excelToSchema: {
                unmappedFields: unmappedExcel,
            },

            summary: {
                errorCount: errors.length,
                warningCount: warnings.length,
                requiredMissingCount: requiredMissing.length,
                mappedMissingCount: mappedMissing.length,
                unmappedFieldCount: unmappedExcel.length,
            },
        };

        ctx.data.validationReport = report;

        // ---- Console output
        ctx.log.info(`Validation Summary`);
        ctx.log.info(`Schema: ${report.schemaName}`);
        ctx.log.info(`Sheet: ${report.sheetName}`);
        ctx.log.info(`Errors: ${report.summary.errorCount}`);
        ctx.log.info(`Warnings: ${report.summary.warningCount}`);

        ctx.log.info(`Schema → Excel`);
        ctx.log.info(`  Required missing: ${report.summary.requiredMissingCount}`);
        ctx.log.info(`  Mapped missing: ${report.summary.mappedMissingCount}`);

        ctx.log.info(`Excel → Schema`);
        ctx.log.info(`  Unmapped fields: ${report.summary.unmappedFieldCount}`);

        if (errors.length) {
            errors.slice(0, 20).forEach((e) => ctx.log.error(e));
            throw new Error(`Schema validation failed.`);
        }

        if (warnings.length) {
            warnings.slice(0, 20).forEach((w) => ctx.log.warn(w));
        }

        ctx.log.info("Validation completed ✅");
    },
};

export default plugin;