// src/data/data-builder/plugins/05-validate-schema.ts
import type ExcelJS from "exceljs";
import type { PipelinePlugin } from "../core/pipeline";
import type { SectionFieldGroup, ValidationReport } from "../types";
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

function collectSchemaFieldsBySection(
    obj: any,
    out: Record<string, Set<string>>,
    section: string
) {
    if (!obj || typeof obj !== "object") return;
    out[section] ??= new Set<string>();

    for (const value of Object.values(obj)) {
        if (typeof value === "string") out[section].add(value);
        else if (typeof value === "object") collectSchemaFieldsBySection(value, out, section);
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

function buildSectionBuckets(
    rows: Map<string, number>,
    sectionFields: Record<string, Set<string>>,
    requiredFields: string[]
): Record<string, SectionFieldGroup> {
    const requiredSet = new Set(requiredFields.map(normKey));
    const out: Record<string, SectionFieldGroup> = {};

    for (const [section, fields] of Object.entries(sectionFields)) {
        const requiredMissing: string[] = [];
        const mappedMissing: string[] = [];

        for (const field of fields) {
            if (rows.has(normKey(field))) continue;
            if (requiredSet.has(normKey(field))) requiredMissing.push(field);
            else mappedMissing.push(field);
        }

        if (requiredMissing.length || mappedMissing.length) {
            out[section] = { requiredFields: requiredMissing, schemaMappingFields: mappedMissing };
        }
    }

    return out;
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
        const { rows, duplicates } = collectExcelFields(ws, layout.fieldCol, layout.dataStartRow);

        const schemaFields = new Set<string>();
        const sectionFields: Record<string, Set<string>> = {};

        for (const [section, value] of Object.entries(schema.groups)) {
            collectSchemaFields(value, schemaFields);
            collectSchemaFieldsBySection(value, sectionFields, section);
        }

        for (const [section, rep] of Object.entries(schema.repeatedGroups ?? {})) {
            schemaFields.add(rep.countField);
            collectSchemaFields(rep.groups, schemaFields);

            sectionFields[section] ??= new Set<string>();
            sectionFields[section].add(rep.countField);
            collectSchemaFieldsBySection(rep.groups, sectionFields, section);
        }

        const requiredMissing = missingFields(rows, schema.requiredFields ?? []);
        const mappedMissing = missingFields(rows, schemaFields);

        const excelFields = new Set([...rows.keys()]);
        const schemaFieldKeys = new Set([...schemaFields].map(normKey));
        const unmappedExcel = [...excelFields].filter((f) => !schemaFieldKeys.has(f));

        const errors: string[] = [];
        requiredMissing.forEach((f) => errors.push(`Missing required field: ${f}`));
        if (strict) {
            duplicates.forEach((f) => errors.push(`Duplicate Excel field: ${f}`));
        }

        const bySection = buildSectionBuckets(rows, sectionFields, schema.requiredFields ?? []);
        const mode: "normal" | "strict" = strict ? "strict" : "normal";

        const report: ValidationReport = {
            schemaName: ctx.data.schemaName,
            sheetName: ctx.data.sheetName,
            mode,
            generatedAt: new Date().toISOString(),
            errors,
            missingSchemaFieldsInExcel: {
                requiredFields: requiredMissing,
                schemaMappingFields: mappedMissing,
                bySection,
            },
            missingExcelFieldsInSchema: {
                unusedExcelFields: unmappedExcel,
            },
            summary: {
                errorCount: errors.length,
                missingSchemaFieldsInExcelCount: mappedMissing.length + requiredMissing.length,
                missingExcelFieldsInSchemaCount: unmappedExcel.length,
            },
        };

        ctx.data.validationReport = report;

        ctx.log.info("Validation Summary");
        ctx.log.info(`Schema: ${report.schemaName}`);
        ctx.log.info(`Sheet: ${report.sheetName}`);
        ctx.log.info(`Errors: ${report.summary.errorCount}`);

        ctx.log.info("Missing Schema Mapping Fields in Excel");
        ctx.log.info(`  Required fields missing: ${report.missingSchemaFieldsInExcel.requiredFields.length}`);
        ctx.log.info(`  Schema Mapping fields missing: ${report.missingSchemaFieldsInExcel.schemaMappingFields.length}`);

        const sections = Object.entries(report.missingSchemaFieldsInExcel.bySection);
        if (sections.length) {
            ctx.log.info("  By section:");
            sections.forEach(([section, data]) => {
                const total = data.requiredFields.length + data.schemaMappingFields.length;
                ctx.log.info(`    ${section}: ${total}`);
            });
        }

        ctx.log.info("Missing Excel Fields in Schema");
        ctx.log.info(`  Unused Excel field: ${report.summary.missingExcelFieldsInSchemaCount}`);

        if (errors.length) {
            errors.slice(0, 20).forEach((e) => ctx.log.error(e));
            throw new Error("Schema validation failed.");
        }

        report.missingSchemaFieldsInExcel.schemaMappingFields
            .slice(0, 20)
            .forEach((f) => ctx.log.warn(`Missing Schema mapping field: ${f}`));

        report.missingExcelFieldsInSchema.unusedExcelFields
            .slice(0, 20)
            .forEach((f) => ctx.log.info(`Unused Excel field: ${f}`));

        ctx.log.info("Validation completed ✅");
    },
};

export default plugin;